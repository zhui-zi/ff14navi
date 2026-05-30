const FEEDS = {
  cn:  'https://rsshub.app/ff14/zh/news',
  int: 'https://rsshub.app/ff14/global/na/all',
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS })
  }

  const feed = new URL(context.request.url).searchParams.get('feed') || 'cn'
  const url  = FEEDS[feed] ?? FEEDS.cn

  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ff14navi-proxy/1.0)' },
    })
    const text = await upstream.text()
    return new Response(text, {
      status: upstream.status,
      headers: {
        ...CORS,
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, max-age=300',
      },
    })
  } catch (e) {
    return new Response(`Proxy error: ${e.message}`, {
      status: 502,
      headers: CORS,
    })
  }
}
