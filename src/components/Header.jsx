import { useState, useRef, useEffect } from 'react'

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const EASE   = 'cubic-bezier(0.4, 0, 0.2, 1)'

const GITHUB_URL = 'https://github.com/zhui-zi/ff14navi/issues'
const EMAIL = 'zhuizi@hotmail.com'

const SWATCHES = [
  { key: 'purple',  color: '#CEB4F8', label: '浅紫' },
  { key: 'gold',    color: '#F4C161', label: '耀金' },
  { key: 'crystal', color: '#7BE7FF', label: '水晶蓝' },
]

// M3 icon button — no fill, primary-tinted state layer on hover
const BTN = {
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  color: 'var(--header-crystal)',
  cursor: 'pointer',
  flexShrink: 0,
  outline: 'none',
  transition: `background 0.18s ${EASE}`,
}

// Drop-down tonal panel — springs in with M3 Expressive motion
function Flyout({ open, children }) {
  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      transformOrigin: 'top right',
      transform: open ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.92)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: `opacity 0.18s ${EASE}, transform 0.26s ${SPRING}`,
      display: 'flex', alignItems: 'center',
      gap: '0.5rem',
      padding: '0.4rem 0.875rem',
      borderRadius: '9999px',
      background: 'var(--md-surface-container-highest)',
      border: '1.5px solid var(--md-outline-variant)',
      boxShadow: '0 6px 24px rgba(0,0,0,0.28)',
      whiteSpace: 'nowrap',
      zIndex: 50,
    }}>
      {children}
    </div>
  )
}

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

// ── Palette Switcher ──────────────────────────────────────────────────────────
function PaletteSwitcher({ palette, setPalette }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const currentColor = SWATCHES.find(s => s.key === palette)?.color ?? SWATCHES[0].color

  useClickOutside(ref, () => setOpen(false))

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        style={BTN}
        onClick={() => setOpen(v => !v)}
        title="切换主题色"
        aria-label="切换主题色"
        onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--header-crystal) 16%, transparent)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span style={{
          width: 10, height: 10, borderRadius: '50%',
          background: currentColor,
          boxShadow: `0 0 7px ${currentColor}BB`,
          flexShrink: 0,
        }} />
      </button>

      <Flyout open={open}>
        {SWATCHES.map(s => (
          <button
            key={s.key}
            className={`palette-swatch${palette === s.key ? ' active' : ''}`}
            title={s.label}
            aria-label={`切换至${s.label}主题`}
            onClick={() => { setPalette(s.key); setOpen(false) }}
            style={{ background: s.color }}
          />
        ))}
      </Flyout>
    </div>
  )
}

// ── Theme Toggle ──────────────────────────────────────────────────────────────
function ThemeToggle({ pref, cycle }) {
  const ICON  = { auto: '✦', light: '☀', dark: '☽' }
  const LABEL = { auto: '跟随系统', light: '浅色模式', dark: '深色模式' }
  return (
    <button
      onClick={cycle}
      style={BTN}
      title={`${LABEL[pref]}（点击切换）`}
      aria-label={LABEL[pref]}
      onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--header-crystal) 16%, transparent)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span key={pref} className="theme-icon">{ICON[pref]}</span>
    </button>
  )
}

// ── Feedback Button ───────────────────────────────────────────────────────────
function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useClickOutside(ref, () => setOpen(false))

  const linkStyle = {
    display: 'flex', alignItems: 'center', gap: '0.3rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem', fontWeight: 600,
    color: 'var(--md-on-surface-variant)',
    textDecoration: 'none',
    transition: `background 0.15s ${EASE}`,
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={BTN}
        title="意见反馈"
        aria-label="意见反馈"
        onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--header-crystal) 16%, transparent)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      <Flyout open={open}>
        <a
          href={GITHUB_URL}
          target="_blank" rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--md-primary) 12%, transparent)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <div style={{ width: 1, height: '0.875rem', background: 'var(--md-outline-variant)', opacity: 0.5, flexShrink: 0 }} />
        <a
          href={`mailto:${EMAIL}`}
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--md-primary) 12%, transparent)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          邮件
        </a>
      </Flyout>
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────
export default function Header({ themePref = 'auto', themeEffective = 'dark', onCycleTheme, palette = 'purple', onSetPalette }) {
  return (
    <div
      className="relative select-none"
      style={{ minHeight: 'clamp(140px, 22vw, 200px)', background: 'var(--header-bg)' }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--header-glow-1) 0%, transparent 65%)' }} />
        <div className="absolute -top-16 right-1/3 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--header-glow-2) 0%, transparent 65%)' }} />
        <div className="absolute top-0 -right-16 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--header-glow-3) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'var(--header-strip)' }} />
      </div>

      {/* M3 Expressive action bar — horizontal pill, tonal+glass, top-right */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        gap: '0.125rem',
        padding: '0.25rem',
        borderRadius: '9999px',
        background: 'color-mix(in srgb, var(--md-surface-container-high) 80%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1.5px solid color-mix(in srgb, var(--header-crystal) 22%, var(--md-outline-variant))',
        zIndex: 10,
      }}>
        {onSetPalette && <PaletteSwitcher palette={palette} setPalette={onSetPalette} />}
        <ThemeToggle pref={themePref} cycle={onCycleTheme} />
        <FeedbackButton />
      </div>

      {/* Title content */}
      <div className="relative flex flex-col justify-center" style={{ minHeight: 'clamp(140px, 22vw, 200px)' }}>
        <div className="w-full max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="crystal-glyph text-3xl mb-2 sm:mb-3" style={{ color: 'var(--header-crystal)' }}>✦</div>

          <h1 className="tracking-tight mb-1" style={{
            fontFamily: '"Noto Serif SC", serif',
            fontWeight: 900,
            fontSize: 'clamp(1.6rem, 5vw, 3.2rem)',
            background: 'linear-gradient(135deg, var(--md-primary) 0%, var(--md-tertiary) 55%, var(--md-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            背水咖啡厅
          </h1>

          <p className="mb-2" style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            fontSize: 'clamp(0.75rem, 1.8vw, 1rem)',
            letterSpacing: '0.18em',
            color: 'var(--md-primary)',
            opacity: 0.75,
          }}>
            The Last Stand
          </p>

          {/* Subtitle as M3 chip */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.25rem 0.875rem',
              borderRadius: '9999px',
              background: 'color-mix(in srgb, var(--md-surface-container-high) 70%, transparent)',
              border: '1px solid color-mix(in srgb, var(--header-crystal) 25%, var(--md-outline-variant))',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              fontSize: '0.7rem', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--header-subtitle)',
            }}>
              <span style={{ color: 'var(--header-crystal)', fontSize: '0.6rem', opacity: 0.7 }}>✦</span>
              Final Fantasy XIV · 工具导航站
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
