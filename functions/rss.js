const FEED_PATHS = {
  cn:  '/ff14/zh/news',
  int: '/ff14/global/na/all',
}

// Ordered by expected reliability from Cloudflare egress IPs.
// rsshub.app blocks CF-to-CF requests; independent instances are listed first.
const INSTANCES = [
  'https://rss.injahow.cn',
  'https://rsshub.rssforever.com',
  'https://rss.shab.fun',
  'https://rsshub.fly.dev',
  'https://rsshub.app',
]

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
}

const UA = 'Mozilla/5.0 (compatible; ff14navi-proxy/1.0; +https://ff14.cafe)'

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS })
  }

  const feed = new URL(context.request.url).searchParams.get('feed') || 'cn'
  const path = FEED_PATHS[feed] ?? FEED_PATHS.cn
  let lastErr = 'no instances tried'

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
