import { useState } from 'react'

const THEME_META = {
  dark:  { icon: '🌙', label: '深色', next: '→ 浅色' },
  light: { icon: '☀️', label: '浅色', next: '→ 自动' },
  auto:  { icon: '🌓', label: '跟随系统', next: '→ 深色' },
}

const GITHUB_URL = 'https://github.com/zhui-zi/ff14navi/issues'
const EMAIL = 'zhuizi@hotmail.com'

function FeedbackButton() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="absolute z-20"
      style={{
        top: 'calc(1rem + 2.5rem + 0.5rem)',
        right: '1rem',
        display: 'flex',
        alignItems: 'center',
        height: '2.5rem',
        borderRadius: '9999px',
        background: 'var(--md-surface-container)',
        color: 'var(--md-on-surface-variant)',
        overflow: 'hidden',
        maxWidth: open ? '16rem' : '2.5rem',
        transform: open ? 'translateX(0)' : 'translateX(2.25rem)',
        transition: 'max-width 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
        <span
          style={{
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '1rem',
            lineHeight: 1,
          }}
        >
          💬
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            paddingRight: '0.5rem',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.15s ease',
          }}
        >
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--md-on-surface-variant)',
              textDecoration: 'none',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--md-surface-container-high)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>

          <span style={{ opacity: 0.25, fontSize: '0.75rem' }}>|</span>

          <a
            href={`mailto:${EMAIL}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--md-on-surface-variant)',
              textDecoration: 'none',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--md-surface-container-high)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            邮件
          </a>
        </div>
    </div>
  )
}

export default function Header({ theme, isDark, cycleTheme }) {
  const meta = THEME_META[theme] ?? THEME_META.auto

  return (
    /* Wrapper controls the height; buttons sit here, outside overflow-hidden */
    <div
      className="relative select-none"
      style={{ minHeight: 'clamp(140px, 22vw, 200px)', background: 'var(--header-bg)' }}
    >
      {/* Background layer — overflow-hidden only clips the ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(circle, var(--header-glow-1) 0%, transparent 65%)` }} />
        <div className="absolute -top-16 right-1/3 w-72 h-72 rounded-full"
          style={{ background: `radial-gradient(circle, var(--header-glow-2) 0%, transparent 65%)` }} />
        <div className="absolute top-0 -right-16 w-80 h-80 rounded-full"
          style={{ background: `radial-gradient(circle, var(--header-glow-3) 0%, transparent 65%)` }} />
      </div>

      {/* Buttons — outside overflow-hidden so capsule expands freely */}
      <FeedbackButton />

      <button
        onClick={cycleTheme}
        className="theme-toggle-btn absolute top-4 right-4 w-10 h-10 rounded-full z-20"
        style={{
          background: 'var(--md-surface-container)',
          color: 'var(--md-on-surface-variant)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
        aria-label={`${meta.label}（点击${meta.next}）`}
        title={`当前：${meta.label}  点击${meta.next}`}
      >
        <span key={theme} className="theme-icon" style={{ fontSize: '1.1rem', lineHeight: 1, display: 'flex' }}>
          {meta.icon}
        </span>
      </button>

      {/* Content */}
      <div className="relative flex flex-col justify-center" style={{ minHeight: 'clamp(140px, 22vw, 200px)' }}>
        <div className="w-full max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="text-3xl mb-2 sm:mb-3 opacity-90" style={{ color: 'var(--header-crystal)' }}>✦</div>

          <h1 className="tracking-tight mb-1" style={{
            fontFamily: '"Noto Serif SC", serif',
            fontWeight: 900,
            fontSize: 'clamp(1.6rem, 5vw, 3.2rem)',
            background: 'linear-gradient(135deg, var(--md-primary) 0%, var(--md-tertiary) 60%, var(--md-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            背水咖啡厅
          </h1>

          <p className="mb-1" style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            fontSize: 'clamp(0.75rem, 1.8vw, 1rem)',
            letterSpacing: '0.18em',
            color: 'var(--md-primary)',
            opacity: 0.75,
          }}>
            The Last Stand
          </p>

          <p className="text-xs font-medium tracking-[0.2em] uppercase mt-2"
            style={{ color: 'var(--header-subtitle)' }}>
            Final Fantasy XIV · 工具导航站
          </p>
        </div>
      </div>
    </div>
  )
}
