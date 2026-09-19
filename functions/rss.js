const FEED_PATHS = {
  cn:  '/ff14/zh/all',
  int: '/ff14/global/na/all',
}

const CN_API = 'https://cqnews.web.sdo.com/api/news/newsList?gameCode=ff&CategoryCode=7141&pageIndex=0&pageSize=10'

// Ordered by expected reliability from Cloudflare egress IPs.
// rsshub.app blocks CF-to-CF requests; independent instances are listed first.
// rss.injahow.cn returns only 3 items with broken ff.sdo.com links — deprioritized.
const INSTANCES = [
  'https://rsshub.rssforever.com',
  'https://rss.shab.fun',
  'https://rsshub.fly.dev',
  'https://rsshub.app',
  'https://rss.injahow.cn',
]

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
}

const UA = 'Mozilla/5.0 (compatible; ff14navi-proxy/1.0; +https://ff14.cafe)'

function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function toRss(items) {
  const body = items.map(item => `
    <item>
      <title>${escapeXml(item.Title)}</title>
      <link>${escapeXml(item.OutLink || `https://ff.web.sdo.com/web8/index.html#/newstab/newscont/${item.Id}`)}</link>
      <guid>${escapeXml(item.Id)}</guid>
      <pubDate>${escapeXml(item.PublishDate)}</pubDate>
      <description>${escapeXml(item.Summary)}</description>
    </item>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>FF14 国服公告</title>${body}</channel></rss>`
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS })
  }

  const feed = new URL(context.request.url).searchParams.get('feed') || 'cn'
  const path = FEED_PATHS[feed] ?? FEED_PATHS.cn
  let lastErr = 'no instances tried'

  // RSSHub's CN route is no longer reliable. The official site exposes the
  // same announcements through this JSON endpoint.
  if (feed === 'cn') {
    try {
      const resp = await fetch(CN_API, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
      if (resp.ok) {
        const data = await resp.json()
        if (data.Code === '0' && Array.isArray(data.Data)) {
          return new Response(toRss(data.Data), {
            headers: {
              ...CORS,
              'Content-Type': 'application/rss+xml; charset=utf-8',
              'Cache-Control': 'public, s-maxage=300, max-age=300',
              'X-Served-By': 'cqnews.web.sdo.com',
            },
          })
        }
        lastErr = `cqnews.web.sdo.com → invalid response`
      } else {
        lastErr = `cqnews.web.sdo.com → HTTP ${resp.status}`
      }
    } catch (e) {
      lastErr = `cqnews.web.sdo.com → ${e.message}`
    }
  }

  for (const base of INSTANCES) {
    try {
      const resp = await fetch(base + path, {
        headers: { 'User-Agent': UA, 'Accept': 'application/rss+xml, application/xml, */*' },
      })
      if (resp.ok) {
        const text = await resp.text()
        return new Response(text, {
          headers: {
            ...CORS,
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=300, max-age=300',
            'X-Served-By': base,
          },
        })
      }
      lastErr = `${base} → HTTP ${resp.status}`
    } catch (e) {
      lastErr = `${base} → ${e.message}`
    }
  }

  return new Response(`All RSS instances failed. Last: ${lastErr}`, {
    status: 502,
    headers: { ...CORS, 'Content-Type': 'text/plain' },
  })
}
