const SOURCE_URL = 'https://ff14.huijiwiki.com/wiki/首页'
const CACHE_TTL = 300
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' }
const OFFICIAL_URLS = {
  '版本7.58维护更新': 'https://ff.web.sdo.com/web8/index.html#/newstab/newscont/394876',
  '守护天节 2026': 'https://actff1.web.sdo.com/project/20261005All_Saints_Wake/hjwff6jkcti4/index.html',
  '月卡礼赠': 'https://actff1.web.sdo.com/20260704_CardBill/gift/index.html#/index',
  '月卡启航计划': 'https://actff1.web.sdo.com/20260704_CardBill/index.html#/index',
  '黄金的试炼第87期': 'https://actff1.web.sdo.com/20241130_GoldTrial/#/index',
}
const ACTIVITY_RULES = [
  { id: 'next-patch', match: /版本\s*7\.58\s*维护更新/, badge: '下个版本', accent: '#4DD0E1', official: '版本7.58维护更新' },
  { id: 'fan-fest', match: /FANFEST\s*2026\s*in\s*东京/i, badge: '特别活动', accent: '#C39BFF', official: null },
  { id: 'all-saints', match: /守护天节\s*2026/, badge: '季节活动', accent: '#FFAB76', official: '守护天节 2026' },
  { id: 'magic-key', match: /魔光键影/, badge: '运营活动', accent: '#81C784', official: null },
  { id: 'card-gift', match: /月卡礼赠/, badge: '国服运营活动', accent: '#AB80D7', official: '月卡礼赠' },
  { id: 'card-plan', match: /月卡启航计划/, badge: '国服运营活动', accent: '#F06292', official: '月卡启航计划' },
  { id: 'gold-trial', match: /黄金的试炼第\d+期/, badge: '运营活动', accent: '#FFAB76', official: '黄金的试炼第87期' },
]

function decodeHtml(value) {
  return String(value ?? '')
    .replace(/<br\s*\/?>(?=.)/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#x20;|&#32;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ').trim()
}

function remainingTarget(text, label) {
  const match = text.match(new RegExp(`距\\s*${label}还有\\s*(\\d+)\\s*天\\s*(\\d+)\\s*时\\s*(\\d+)\\s*分(?:\\s*(\\d+)\\s*秒)?`))
  if (!match) return null
  const [, days, hours, minutes, seconds = '0'] = match
  return new Date(Date.now() + (((Number(days) * 24 + Number(hours)) * 60 + Number(minutes)) * 60 + Number(seconds)) * 1000).toISOString()
}

function parseActivities(html) {
  const anchors = [...html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)]
  const activities = []
  for (const rule of ACTIVITY_RULES) {
    const hit = anchors.find(anchor => rule.match.test(decodeHtml(anchor[1])))
    if (!hit) continue
    const title = decodeHtml(hit[1])
    const start = hit.index ?? 0
    const context = decodeHtml(html.slice(start, start + 1800))
    const rows = []
    const startTarget = remainingTarget(context, '开始')
    const endTarget = remainingTarget(context, '结束')
    if (startTarget) rows.push({ label: '距开始', target: startTarget, expired: '进行中' })
    if (endTarget) rows.push({ label: '距结束', target: endTarget, expired: '已结束' })
    activities.push({
      id: rule.id,
      title,
      badge: rule.badge,
      accent: rule.accent,
      subtitle: context.includes('进行中') ? '进行中' : '',
      dates: [context.replace(title, '').slice(0, 180)].filter(Boolean),
      rows,
      url: rule.official ? OFFICIAL_URLS[rule.official] : 'https://ff.web.sdo.com/web8/index.html#/newstab/newslist',
    })
  }
  return activities
}

function jsonResponse(data, extra = {}) {
  return new Response(JSON.stringify(data), {
    headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': `public, s-maxage=${CACHE_TTL}, max-age=${CACHE_TTL}`, ...extra },
  })
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (context.request.method !== 'GET') return new Response('Method Not Allowed', { status: 405, headers: CORS })
  const cache = typeof caches === 'undefined' || !caches.default ? null : caches.default
  const cacheKey = new Request(new URL('/activities?source=huiji', context.request.url), context.request)
  const cached = cache ? await cache.match(cacheKey) : null
  try {
    const response = await fetch(SOURCE_URL, {
      headers: { 'User-Agent': 'ff14navi-activity-crawler/1.0', Accept: 'text/html' },
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`Huiji HTTP ${response.status}`)
    const activities = parseActivities(await response.text())
    if (!activities.length) throw new Error('No supported activities found')
    const fresh = jsonResponse({ source: SOURCE_URL, fetchedAt: new Date().toISOString(), activities }, { 'X-Activity-Source': 'huijiwiki' })
    if (cache) await cache.put(cacheKey, fresh.clone())
    return fresh
  } catch (error) {
    if (cached) return new Response(cached.body, { headers: { ...Object.fromEntries(cached.headers), 'X-Activity-Source': 'edge-cache-stale' } })
    return jsonResponse({ error: error.message, source: SOURCE_URL, activities: [] }, { status: 502 })
  }
}
