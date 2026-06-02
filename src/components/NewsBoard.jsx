import { useState, useEffect, useCallback } from 'react'

const FEEDS = {
  cn:  { label: '国服',   path: '/rss?feed=cn' },
  int: { label: '国际服', path: '/rss?feed=int' },
}

const CN_NEWS_LIST = 'https://ff.sdo.com/web8/index.html#/newstab/newslist'

const get = (el, tag) => el.getElementsByTagName(tag)[0]?.textContent?.trim() || ''

// RSSHub FF14 CN route uses stale ff.sdo.com domain (correct: ff.web.sdo.com)
// and omits index.html#/ for SPA routes like /web8/555
function fixLink(url) {
  if (!url?.startsWith('http')) return ''
  url = url.replace('https://ff.sdo.com/web8/', 'https://ff.web.sdo.com/web8/')
  const m = url.match(/^(https:\/\/ff\.web\.sdo\.com\/web8\/)(\d+)$/)
  return m ? `${m[1]}index.html#/newstab/newscont/${m[2]}` : url
}

function parseRSS(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.querySelector('parsererror')) throw new Error('RSS 解析失败')
  return [...doc.getElementsByTagName('item')].slice(0, 3).map(item => {
    const title   = get(item, 'title')
    const linkEl  = item.getElementsByTagName('link')[0]
    const rawLink = linkEl?.textContent?.trim() || linkEl?.getAttribute('href') || get(item, 'guid')
    const link    = fixLink(rawLink) || CN_NEWS_LIST
    const pubDate = get(item, 'pubDate')
    const date    = pubDate ? new Date(pubDate) : null
    const dateStr = date && !isNaN(date)
      ? `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
      : ''
    return { title, link, dateStr }
  })
}

export default function NewsBoard({ noWrap = false }) {
  const [server,  setServer]  = useState('cn')
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchFeed = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch(FEEDS[server].path)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then(xml => { setItems(parseRSS(xml)); setLoading(false) })
      .catch(e  => { setError(e.message);     setLoading(false) })
  }, [server])

  useEffect(() => { fetchFeed() }, [fetchFeed])

  const board = (
    <div
      className="rounded-2xl overflow-hidden h-full"
      style={{
        background: 'linear-gradient(145deg, rgba(206,180,248,0.10) 0%, var(--glass-bg) 50%)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid rgba(206,180,248,0.18)',
        borderTopColor: 'rgba(206,180,248,0.35)',
        boxShadow: 'var(--glass-shadow), 0 0 40px rgba(206,180,248,0.06), var(--glass-inset)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(206,180,248,0.12)' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--md-primary)', opacity: 0.7, fontSize: '0.75rem' }}>■</span>
          <span className="text-xs font-semibold tracking-widest"
            style={{ color: 'var(--md-on-surface-variant)', letterSpacing: '0.15em' }}>
            游戏公告
          </span>
        </div>
        <div className="flex gap-1">
          {Object.entries(FEEDS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setServer(key)}
              className="px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150"
              style={server === key ? {
                background: 'var(--md-primary)',
                color: 'var(--md-on-primary)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.20)',
              } : {
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--md-on-surface-variant)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div>
          {[72, 55, 65].map((w, i) => (
            <div key={i} className="px-4 py-3.5"
              style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div className="skeleton rounded-md mb-2" style={{ height: '14px', width: `${w}%` }} />
              <div className="skeleton rounded-md" style={{ height: '11px', width: '52px' }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center justify-between px-4 py-4 gap-3">
          <span className="text-xs" style={{ color: 'var(--md-outline)' }}>加载失败</span>
          <button
            onClick={fetchFeed}
            className="text-xs px-3 py-1.5 rounded-full flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--md-primary)' }}
          >
            重试
          </button>
        </div>
      )}

      {/* Items */}
      {!loading && !error && (
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col px-4 py-3 gap-0.5"
                style={{
                  borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <span className="text-sm leading-snug line-clamp-2" style={{ color: 'var(--md-on-surface)' }}>
                  {item.title}
                </span>
                <span className="text-xs tabular-nums mt-0.5" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.6 }}>
                  {item.dateStr}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  if (noWrap) return board
  return <div className="max-w-7xl mx-auto px-4 mb-6">{board}</div>
}
