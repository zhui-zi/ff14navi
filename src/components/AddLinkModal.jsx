import { useState, useEffect, useRef } from 'react'

const STYLES = [
  { id: 'basic',  label: '默认',  color: '#CCC5CF' },
  { id: 'blue',   label: '蓝',    color: '#90CAF9' },
  { id: 'green',  label: '绿',    color: '#A5D6A7' },
  { id: 'red',    label: '红',    color: '#EF9A9A' },
  { id: 'pink',   label: '粉',    color: '#F48FB1' },
  { id: 'orange', label: '橙',    color: '#FFCC80' },
  { id: 'teal',   label: '青',    color: '#80DEEA' },
  { id: 'violet', label: '紫',    color: '#CE93D8' },
  { id: 'yellow', label: '黄',    color: '#FFF176' },
  { id: 'brown',  label: '棕',    color: '#BCAAA4' },
]

const STYLE_BG = {
  basic:  'rgba(74,69,78,0.38)',
  blue:   'rgba(33,150,243,0.16)',
  green:  'rgba(76,175,80,0.16)',
  red:    'rgba(244,67,54,0.16)',
  pink:   'rgba(233,30,99,0.16)',
  orange: 'rgba(255,152,0,0.16)',
  teal:   'rgba(0,188,212,0.16)',
  violet: 'rgba(156,39,176,0.18)',
  yellow: 'rgba(255,235,59,0.14)',
  brown:  'rgba(121,85,72,0.25)',
}

export default function AddLinkModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [url, setUrl]   = useState('')
  const [style, setStyle] = useState('basic')
  const [error, setError] = useState('')
  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('请输入链接名称'); return }
    let normalizedUrl = url.trim()
    if (!normalizedUrl) { setError('请输入链接地址'); return }
    if (!/^https?:\/\//i.test(normalizedUrl)) normalizedUrl = 'https://' + normalizedUrl
    try { new URL(normalizedUrl) } catch { setError('链接地址格式不正确'); return }
    onAdd({ id: Date.now().toString(), name: name.trim(), url: normalizedUrl, style })
    onClose()
  }

  const selectedStyle = STYLES.find(s => s.id === style)

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 shadow-2xl animate-slide-up"
        style={{ background: 'var(--md-surface-container-highest)' }}
      >
        <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--md-on-surface)' }}>
          ✦ 添加自定义链接
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--md-on-surface-variant)' }}>
            链接名称
          </label>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            placeholder="例：我常用的工具"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none mb-4"
            style={{
              background: 'var(--md-surface-container)',
              color: 'var(--md-on-surface)',
              border: '2px solid var(--md-outline-variant)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--md-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--md-outline-variant)'}
          />

          {/* URL */}
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--md-on-surface-variant)' }}>
            链接地址
          </label>
          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); setError('') }}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none mb-4"
            style={{
              background: 'var(--md-surface-container)',
              color: 'var(--md-on-surface)',
              border: '2px solid var(--md-outline-variant)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--md-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--md-outline-variant)'}
          />

          {/* Style picker */}
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--md-on-surface-variant)' }}>
            颜色标签
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {STYLES.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                style={{
                  background: STYLE_BG[s.id],
                  color: s.color,
                  outline: style === s.id ? `2px solid ${s.color}` : '2px solid transparent',
                  outlineOffset: '1px',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="mb-5 h-9 flex items-center">
            {name && (
              <span
                className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium"
                style={{ background: STYLE_BG[style], color: selectedStyle.color }}
              >
                {name}
              </span>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs mb-3" style={{ color: '#EF9A9A' }}>{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium"
              style={{ background: 'var(--md-surface-container-high)', color: 'var(--md-on-surface-variant)' }}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full text-sm font-bold"
              style={{ background: 'var(--md-primary)', color: 'var(--md-on-primary)' }}
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
