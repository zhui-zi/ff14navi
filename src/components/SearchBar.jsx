import { useState, useRef } from 'react'

const STORAGE_KEY = 'ff14navi-search-mode'

const MODES = [
  { id: 'wiki',   label: 'WIKI搜索', icon: '📖', placeholder: '在中文维基中搜索，回车确认' },
  { id: 'item',   label: '物品搜索', icon: '🔮', placeholder: '在中文维基中搜索，回车确认' },
  { id: 'nga',    label: 'NGA',      icon: '📋' },
  { id: 'google', label: 'Google',   icon: '🌐' },
  { id: 'bing',   label: 'Bing',     icon: '🔷' },
  { id: 'baidu',  label: '百度',     icon: '🔵' },
]

const SEARCH_URL = {
  wiki:   q => `https://ff14.huijiwiki.com/index.php?title=%E7%89%B9%E6%AE%8A:%E6%90%9C%E7%B4%A2&profile=default&search=${encodeURIComponent(q)}&sort=just_match`,
  item:   q => `https://ff14.huijiwiki.com/wiki/ItemSearch?name=${encodeURIComponent(q)}`,
  nga:    q => `https://nga.178.com/thread.php?key=${encodeURIComponent(q)}&fid=-362960&content=4`,
  google: q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  bing:   q => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
  baidu:  q => `https://www.baidu.com/s?wd=${encodeURIComponent(q)}`,
}

function loadMode() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return MODES.some(m => m.id === saved) ? saved : 'wiki'
}

export default function SearchBar() {
  const [mode,  setModeState] = useState(loadMode)
  const [query, setQuery]     = useState('')
  const inputRef = useRef(null)
  const current  = MODES.find(m => m.id === mode)

  const setMode = id => {
    setModeState(id)
    localStorage.setItem(STORAGE_KEY, id)
    inputRef.current?.focus()
  }

  const doSearch = q => {
    if (!q.trim()) return
    window.open(SEARCH_URL[mode](q.trim()), '_blank', 'noopener,noreferrer')
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter')  doSearch(query)
    if (e.key === 'Escape') { setQuery(''); inputRef.current?.blur() }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
      <div className="flex items-center gap-2">
        {/* Input pill */}
        <div
          className="search-bar-wrap flex-1 flex items-center rounded-full overflow-hidden"
          style={{ background: 'var(--md-surface-container)', border: '2px solid var(--md-outline-variant)', transition: 'border-color 0.25s, box-shadow 0.3s' }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--md-primary)'}
          onBlurCapture={e  => e.currentTarget.style.borderColor = 'var(--md-outline-variant)'}
        >
          <span className="pl-5 text-lg" style={{ color: 'var(--md-outline)' }}>{current?.icon}</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={current?.placeholder ?? `在 ${current?.label} 中搜索，回车确认`}
            className="flex-1 px-4 py-4 text-base outline-none bg-transparent"
            style={{ color: 'var(--md-on-surface)' }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              className="px-3 text-xl leading-none"
              style={{ color: 'var(--md-outline)' }}
              aria-label="清空"
            >×</button>
          )}
        </div>

        {/* Search button — standalone pill */}
        <button
          onClick={() => doSearch(query)}
          className="search-btn flex-shrink-0 px-6 py-4 rounded-full text-sm font-bold"
          style={{ background: 'var(--md-primary)', color: 'var(--md-on-primary)' }}
        >
          搜索
        </button>
      </div>

      <div className="flex gap-2 mt-3 justify-center flex-wrap">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            style={mode === m.id
              ? { background: 'var(--md-primary)', color: 'var(--md-on-primary)', fontWeight: 700 }
              : { background: 'var(--md-surface-container)', color: 'var(--md-on-surface-variant)' }}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
