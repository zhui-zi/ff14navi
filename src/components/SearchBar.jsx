import { useRef } from 'react'

const MODES = [
  { id: 'site',   label: '站内搜索' },
  { id: 'google', label: 'Google' },
  { id: 'bing',   label: 'Bing' },
  { id: 'baidu',  label: '百度' },
]

export default function SearchBar({ query, setQuery, mode, setMode, onSearch }) {
  const inputRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (mode === 'site') return
      onSearch(e.target.value)
    }
    if (e.key === 'Escape') {
      setQuery('')
      inputRef.current?.blur()
    }
  }

  const placeholder = mode === 'site'
    ? '搜索站内链接名称…'
    : `在 ${MODES.find(m => m.id === mode)?.label} 中搜索，按回车确认`

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
      {/* Input */}
      <div
        className="flex items-center rounded-full overflow-hidden"
        style={{
          background: 'var(--md-surface-container)',
          border: '2px solid var(--md-outline-variant)',
          transition: 'border-color 0.2s',
        }}
        onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--md-primary)'}
        onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--md-outline-variant)'}
      >
        {/* Search icon */}
        <span className="pl-5 text-lg" style={{ color: 'var(--md-outline)' }}>
          {mode === 'site' ? '🔍' : mode === 'google' ? '🌐' : mode === 'bing' ? '🔷' : '🔵'}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-4 text-base outline-none bg-transparent"
          style={{ color: 'var(--md-on-surface)' }}
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="px-3 text-xl leading-none"
            style={{ color: 'var(--md-outline)' }}
            aria-label="清空"
          >
            ×
          </button>
        )}

        {/* External search button */}
        {mode !== 'site' && (
          <button
            onClick={() => onSearch(query)}
            className="px-5 py-4 text-sm font-bold rounded-r-full"
            style={{ background: 'var(--md-primary-container)', color: 'var(--md-on-primary-container)' }}
          >
            搜索
          </button>
        )}
      </div>

      {/* Mode pills */}
      <div className="flex gap-2 mt-3 justify-center flex-wrap">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id)
              setQuery('')
              inputRef.current?.focus()
            }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            style={mode === m.id ? {
              background: 'var(--md-primary)',
              color: 'var(--md-on-primary)',
              fontWeight: '700',
            } : {
              background: 'var(--md-surface-container)',
              color: 'var(--md-on-surface-variant)',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
