// Mirrors RSSHub's /ff14/zh/all route categories while keeping the feed on our own edge function.
const CN_API = 'https://cqnews.web.sdo.com/api/news/newsList?gameCode=ff&CategoryCode=5309,5310,5312,8324,8325,8326,8327,5311,5313&pageIndex=0&pageSize=50'
const FEED_PATHS = { int: '/ff14/global/na/all' }
const RSSHUB_INSTANCES = [
  'https://rsshub.rssforever.com',
  'https://rss.shab.fun',
  'https://rsshub.fly.dev',
  'https://rsshub.app',
]

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}
const UA = 'ff14navi-news/2.0 (+https://github.com/zhui-zi/ff14navi)'
const CACHE_TTL = 300

function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

function toRss(items) {
  const body = items.map(item => `
    <item>
      <title>${escapeXml(item.Title)}</title>
      <link>${escapeXml(item.OutLink || `https://ff.web.sdo.com/web8/index.html#/newstab/newscont/${item.Id}`)}</link>
      <guid isPermaLink="false">${escapeXml(item.Id)}</guid>
      <pubDate>${escapeXml(item.PublishDate)}</pubDate>
      <description>${escapeXml(item.Summary)}</description>
    </item>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>最终幻想14（国服）新闻中心</title><link>https://ff.web.sdo.com/web8/index.html#/newstab/newslist</link><description>《最终幻想14》国服新闻、公告、活动与广告</description><language>zh-CN</language>${body}</channel></rss>`
}

function rssResponse(body, extra = {}) {
  return new Response(body, {
    headers: {
      ...CORS,
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': `public, s-maxage=${CACHE_TTL}, max-age=${CACHE_TTL}`,
      ...extra,
    },
  })
}

async function cachedCnFeed(request) {
  const cache = typeof caches === 'undefined' || !caches.default ? null : caches.default
  const cacheKey = new Request(new URL('/rss?feed=cn', request.url), request)
  const cached = cache ? await cache.match(cacheKey) : null

  try {
    const response = await fetch(CN_API, {
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error(`official API HTTP ${response.status}`)
    const data = await response.json()
    if (data.Code !== '0' || !Array.isArray(data.Data) || data.Data.length === 0) {
      throw new Error('official API returned no news')
    }
    const items = [...data.Data].sort((a, b) => new Date(b.PublishDate) - new Date(a.PublishDate))
    const fresh = rssResponse(toRss(items), { 'X-Feed-Source': 'official-cqnews-rsshub-compatible' })
    if (cache) await cache.put(cacheKey, fresh.clone())
    return fresh
  } catch (error) {
    if (cached) {
      return new Response(cached.body, {
        headers: { ...Object.fromEntries(cached.headers), 'X-Feed-Source': 'edge-cache-stale' },
      })
    }
    throw error
  }
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (context.request.method !== 'GET') return new Response('Method Not Allowed', { status: 405, headers: CORS })

  const feed = new URL(context.request.url).searchParams.get('feed') || 'cn'
  if (feed === 'cn') {
    try {
      return await cachedCnFeed(context.request)
    } catch (error) {
      return new Response(`国服公告暂时不可用：${error.message}`, {
        status: 502,
        headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }
  }

  const path = FEED_PATHS[feed]
  if (!path) return new Response('Unknown feed', { status: 404, headers: CORS })
  let lastError = 'no instances tried'
  for (const base of RSSHUB_INSTANCES) {
    try {
      const response = await fetch(base + path, {
        headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, */*' },
        signal: AbortSignal.timeout(8000),
      })
      if (response.ok) return rssResponse(await response.text(), { 'X-Feed-Source': base })
      lastError = `${base} → HTTP ${response.status}`
    } catch (error) {
      lastError = `${base} → ${error.message}`
    }
  }
  return new Response(`International RSS unavailable. Last: ${lastError}`, {
    status: 502,
    headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
