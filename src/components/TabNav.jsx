export default function TabNav({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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
    </div>
  )
}
