export default function Header({ isDark, toggleTheme }) {
  return (
    <header className="relative overflow-hidden select-none flex items-center justify-center" style={{ background: 'var(--header-bg)', minHeight: 'clamp(140px, 22vw, 200px)' }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(circle, var(--header-glow-1) 0%, transparent 65%)` }} />
        <div className="absolute -top-16 right-1/3 w-72 h-72 rounded-full"
          style={{ background: `radial-gradient(circle, var(--header-glow-2) 0%, transparent 65%)` }} />
        <div className="absolute top-0 -right-16 w-80 h-80 rounded-full"
          style={{ background: `radial-gradient(circle, var(--header-glow-3) 0%, transparent 65%)` }} />
      </div>

      {/* Theme toggle — M3 icon button */}
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-lg z-10"
        style={{
          background: 'var(--md-surface-container)',
          color: 'var(--md-on-surface-variant)',
        }}
        aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
        title={isDark ? '切换浅色' : '切换深色'}
      >
        {/* key changes on each toggle → remounts span → triggers CSS animation */}
        <span key={String(isDark)} className="theme-icon text-base leading-none">
          {isDark ? '☀️' : '🌙'}
        </span>
      </button>

      <div className="relative w-full max-w-7xl mx-auto px-4 py-6 flex flex-col items-center text-center">
        <div className="text-3xl mb-2 sm:mb-3 opacity-90" style={{ color: 'var(--header-crystal)' }}>✦</div>

        <h1 className="tracking-tight mb-1 w-full text-center" style={{
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

        <p className="mb-1 text-center w-full" style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          fontSize: 'clamp(0.75rem, 1.8vw, 1rem)',
          letterSpacing: '0.18em',
          color: 'var(--md-primary)',
          opacity: 0.75,
        }}>
          The Last Stand
        </p>

        <p className="text-xs font-medium tracking-[0.2em] uppercase mt-2 text-center w-full"
          style={{ color: 'var(--header-subtitle)' }}>
          Final Fantasy XIV · 工具导航站
        </p>
      </div>
    </header>
  )
}
