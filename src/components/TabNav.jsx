/* Column layout icons — N vertical bars */
function ColIcon({ n }) {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor" aria-hidden="true">
      {Array.from({ length: n }).map((_, i) => {
        const w = (16 - (n - 1) * 2) / n
        const x = i * (w + 2)
        return <rect key={i} x={x} y={0} width={w} height={14} rx={1} />
      })}
    </svg>
  )
}

export default function TabNav({ tabs, activeTab, setActiveTab, columnCount, setColumnCount }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <div className="flex items-center gap-3">
        {/* Tab pills — scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1 min-w-0">
          {tabs.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium"
                style={active ? {
                  background: 'var(--md-primary)',
                  color: 'var(--md-on-primary)',
                  fontWeight: '700',
                  transition: 'all 0.2s',
                } : {
                  background: 'var(--md-surface-container)',
                  color: 'var(--md-on-surface-variant)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--md-surface-container-high)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'var(--md-surface-container)' }}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Column count picker */}
        <div
          className="flex-shrink-0 flex items-center gap-1 p-1 rounded-full"
          style={{ background: 'var(--md-surface-container)' }}
        >
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => setColumnCount(n)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150"
              style={columnCount === n ? {
                background: 'var(--md-primary)',
                color: 'var(--md-on-primary)',
              } : {
                color: 'var(--md-on-surface-variant)',
              }}
              title={`${n} 栏`}
              aria-label={`${n} 栏布局`}
            >
              <ColIcon n={n} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
