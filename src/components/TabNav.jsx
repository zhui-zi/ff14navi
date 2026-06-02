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

function SortIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M3.5 1 L1 4.5 H2.5 V9 H4.5 V4.5 H6 L3.5 1Z" />
      <path d="M10.5 13 L13 9.5 H11.5 V5 H9.5 V9.5 H8 L10.5 13Z" />
    </svg>
  )
}

function AlphaSortIcon() {
  return (
    <svg width="16" height="13" viewBox="0 0 16 13" fill="currentColor" aria-hidden="true">
      <text x="0" y="10" fontSize="7.5" fontFamily="monospace" fontWeight="800">A</text>
      <text x="9" y="10" fontSize="7.5" fontFamily="monospace" fontWeight="800">Z</text>
      <path d="M6.5 1.5 L5 4 H6 V9 H7.5 V4 H8.5 L6.5 1.5Z" />
    </svg>
  )
}

export default function TabNav({ tabs, activeTab, setActiveTab, columnCount, setColumnCount, isSorting, setIsSorting, onResetCatOrder, linkSort, onToggleLinkSort }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <div className="flex items-center gap-3">
        {/* Tab pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1 min-w-0">
          {tabs.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-5 h-10 rounded-full text-sm font-medium"
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

        {/* Column picker + sort toggle — single pill group */}
        <div
          className="flex-shrink-0 flex items-center gap-1 p-1 rounded-full"
          style={{
            background: 'var(--md-surface-container)',
            border: '1px solid var(--md-outline-variant)',
          }}
        >
          {isSorting ? (
            /* Sort mode: replace column buttons with a reset option */
            <button
              onClick={onResetCatOrder}
              className="px-3 h-8 rounded-full text-xs transition-colors duration-150"
              style={{ color: 'var(--md-on-surface-variant)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--md-surface-container-high)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
              title="重置分类顺序"
            >
              重置顺序
            </button>
          ) : (
            /* Normal mode: column count buttons */
            [1, 2, 3, 4].map(n => (
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
            ))
          )}

          {/* Divider */}
          <div className="w-px h-4 rounded-full flex-shrink-0 mx-0.5"
            style={{ background: 'var(--md-outline-variant)' }} />

          {/* Category reorder toggle */}
          <button
            onClick={() => setIsSorting(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150"
            style={isSorting ? {
              background: 'var(--md-primary)',
              color: 'var(--md-on-primary)',
            } : {
              color: 'var(--md-on-surface-variant)',
            }}
            title={isSorting ? '退出排序模式' : '调整分类顺序'}
            aria-label={isSorting ? '退出排序模式' : '调整分类顺序'}
          >
            <SortIcon />
          </button>

          {/* Divider */}
          <div className="w-px h-4 rounded-full flex-shrink-0 mx-0.5"
            style={{ background: 'var(--md-outline-variant)' }} />

          {/* Link alpha-sort toggle */}
          <button
            onClick={onToggleLinkSort}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150"
            style={linkSort === 'alpha' ? {
              background: 'var(--md-primary)',
              color: 'var(--md-on-primary)',
            } : {
              color: 'var(--md-on-surface-variant)',
            }}
            title={linkSort === 'alpha' ? '当前：字母排序' : '当前：默认排序'}
            aria-label="切换链接排序方式"
          >
            <AlphaSortIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
