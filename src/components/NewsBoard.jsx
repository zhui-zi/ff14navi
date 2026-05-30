import { useState, useEffect, useCallback } from 'react'

const FEEDS = {
  cn:  { label: '国服',   url: 'https://rsshub.app/ff14/zh/news' },
  int: { label: '国际服', url: 'https://rsshub.app/ff14/global/na/all' },
}

const get = (el, tag) => el.getElementsByTagName(tag)[0]?.textContent?.trim() || ''

function parseRSS(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.querySelector('parsererror')) throw new Error('RSS 解析失败')
  return [...doc.getElementsByTagName('item')].slice(0, 15).map(item => {
    const title   = get(item, 'title')
    const link    = get(item, 'link') || get(item, 'guid')
    const pubDate = get(item, 'pubDate')
    const date    = pubDate ? new Date(pubDate) : null
    const dateStr = date && !isNaN(date)
      ? `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
      : ''
    return { title, link, dateStr }
  })
}

export default function NewsBoard() {
  const [server, setServer] = useState('cn')
  const [items,  setItems]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,  setError]  = useState(null)

  const fetchFeed = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch(FEEDS[server].url)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then(xml => { setItems(parseRSS(xml)); setLoading(false) })
      .catch(e  => { setError(e.message);     setLoading(false) })
  }, [server])

  useEffect(() => { fetchFeed() }, [fetchFeed])

  return (
    <div className="max-w-7xl mx-auto px-4 mb-6">
      <div className="rounded-3xl overflow-hidden" style={{ background: 'var(--md-surface-container)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: '1px solid var(--md-outline-variant)' }}>
          <div className="flex items-center gap-2">
            <span className="text-base">📰</span>
            <span className="font-bold text-sm" style={{ color: 'var(--md-on-surface)' }}>游戏公告</span>
          </div>
          <div className="flex gap-1.5">
            {Object.entries(FEEDS).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setServer(key)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150"
                style={server === key ? {
                  background: 'var(--md-primary)',
                  color: 'var(--md-on-primary)',
                } : {
                  background: 'var(--md-surface-container-high)',
                  color: 'var(--md-on-surface-variant)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm"
            style={{ color: 'var(--md-outline)' }}>
            <span className="news-spin">↻</span> 加载中…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm" style={{ color: 'var(--md-outline)' }}>
              加载失败：{error}
            </span>
            <button
              onClick={fetchFeed}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'var(--md-surface-container-high)', color: 'var(--md-primary)' }}
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
                  className="flex items-center justify-between px-5 py-2.5 gap-4 transition-colors duration-100"
                  style={{
                    borderBottom: i < items.length - 1 ? '1px solid var(--md-outline-variant)' : 'none',
                    opacity: 0.92,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--md-surface-container-high)'; e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.opacity = '0.92' }}
                >
                  <span className="text-sm truncate" style={{ color: 'var(--md-on-surface)' }}>
                    {item.title}
                  </span>
                  <span className="text-xs flex-shrink-0 tabular-nums"
                    style={{ color: 'var(--md-on-surface-variant)' }}>
                    {item.dateStr}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
