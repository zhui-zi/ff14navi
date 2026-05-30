const THEME_META = {
  dark:  { icon: '🌙', label: '深色', next: '→ 浅色' },
  light: { icon: '☀️', label: '浅色', next: '→ 自动' },
  auto:  { icon: '🌓', label: '跟随系统', next: '→ 深色' },
}

export default function Header({ theme, isDark, cycleTheme }) {
  const meta = THEME_META[theme] ?? THEME_META.auto

  return (
    <header className="relative overflow-hidden select-none flex flex-col justify-center" style={{ background: 'var(--header-bg)', minHeight: 'clamp(140px, 22vw, 200px)' }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(circle, var(--header-glow-1) 0%, transparent 65%)` }} />
        <div className="absolute -top-16 right-1/3 w-72 h-72 rounded-full"
          style={{ background: `radial-gradient(circle, var(--header-glow-2) 0%, transparent 65%)` }} />
        <div className="absolute top-0 -right-16 w-80 h-80 rounded-full"
          style={{ background: `radial-gradient(circle, var(--header-glow-3) 0%, transparent 65%)` }} />
      </div>

      {/* Theme cycle button */}
      <button
        onClick={cycleTheme}
        className="theme-toggle-btn absolute top-4 right-4 w-10 h-10 rounded-full flex flex-col items-center justify-center gap-0 z-10"
        style={{ background: 'var(--md-surface-container)', color: 'var(--md-on-surface-variant)' }}
        aria-label={`${meta.label}（点击${meta.next}）`}
        title={`当前：${meta.label}  点击${meta.next}`}
      >
        <span key={theme} className="theme-icon leading-none" style={{ fontSize: '1rem' }}>
          {meta.icon}
        </span>
      </button>

      <div className="relative w-full max-w-7xl mx-auto px-4 py-6 text-center">
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
    </header>
  )
}
