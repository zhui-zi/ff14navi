import { useMemo, useState } from 'react'
import { categories } from '../data/links'
import LinkChip from './LinkChip'
import ToolsGate from './ToolsGate'

const TOOLS_KEY = 'ff14navi-tools-unlocked'

function CustomChip({ link, onDelete }) {
  const styleClass = `chip-${link.style || 'basic'}`
  return (
    <div className="group relative inline-flex">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`link-chip ${styleClass} inline-flex items-center gap-1.5 pl-4 pr-8 py-2 rounded-2xl text-sm font-medium cursor-pointer select-none whitespace-nowrap`}
      >
        {link.name}
      </a>
      <button
        onClick={() => onDelete(link.id)}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}
        aria-label="删除"
        title="删除此链接"
      >
        ×
      </button>
    </div>
  )
}

/* A single category block — break-inside:avoid keeps it intact in CSS columns */
function CategoryBlock({ cat, searchQuery, isCustom, customLinks, onDeleteCustomLink }) {
  if (isCustom) {
    return (
      <div className="category-block">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-7 rounded-full flex-shrink-0"
            style={{ background: 'linear-gradient(180deg, var(--md-tertiary), var(--md-primary))' }} />
          <h2 className="text-xl font-bold" style={{ color: 'var(--md-on-surface)' }}>我的收藏</h2>
          {customLinks.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--md-surface-container-high)', color: 'var(--md-on-surface-variant)' }}>
              {customLinks.length}
            </span>
          )}
        </div>
        {customLinks.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--md-outline)' }}>
            点击右下角 <strong style={{ color: 'var(--md-primary)' }}>+ 添加自定义链接</strong> 收藏常用网站，数据保存在本地浏览器。
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {customLinks.map(link => (
              <CustomChip key={link.id} link={link} onDelete={onDeleteCustomLink} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const links = searchQuery
    ? cat.links.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : cat.links

  if (links.length === 0) return null

  return (
    <div className="category-block">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-7 rounded-full flex-shrink-0"
          style={{ background: 'linear-gradient(180deg, var(--md-primary), var(--md-tertiary))' }} />
        <h2 className="text-xl font-bold" style={{ color: 'var(--md-on-surface)' }}>{cat.name}</h2>
        <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'var(--md-surface-container-high)', color: 'var(--md-on-surface-variant)' }}>
          {links.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((link, i) => (
          <LinkChip key={`${link.name}-${link.url}-${i}`} link={link} />
        ))}
      </div>
    </div>
  )
}

export default function LinksSection({ activeTab, searchQuery, customLinks, onDeleteCustomLink, columnCount }) {
  const q = searchQuery.trim()
  // Track unlock state so the 'all' tab updates when user unlocks inside 'tools' tab
  const [toolsUnlocked, setToolsUnlocked] = useState(() => !!localStorage.getItem(TOOLS_KEY))

  // Re-check after ToolsGate writes to localStorage
  const checkUnlocked = () => {
    if (!toolsUnlocked && localStorage.getItem(TOOLS_KEY)) setToolsUnlocked(true)
  }

  const visibleCustom = useMemo(() => {
    if (!q) return customLinks
    return customLinks.filter(l => l.name.toLowerCase().includes(q.toLowerCase()))
  }, [customLinks, q])

  const visibleCats = useMemo(() => {
    let cats = categories
    if (activeTab !== 'all') {
      cats = cats.filter(c => c.tab === activeTab)
    } else {
      // Hide tools from 'all' until the user has unlocked them
      if (!toolsUnlocked) cats = cats.filter(c => c.tab !== 'tools')
    }
    if (q) {
      cats = cats
        .map(c => ({ ...c, links: c.links.filter(l => l.name.toLowerCase().includes(q.toLowerCase())) }))
        .filter(c => c.links.length > 0)
    }
    return cats
  }, [activeTab, q, toolsUnlocked])

  const showCustomSection = visibleCustom.length > 0 || (customLinks.length === 0 && activeTab === 'all' && !q)
  const hasAny = showCustomSection || visibleCats.length > 0 || activeTab === 'tools'

  if (!hasAny) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg" style={{ color: 'var(--md-outline)' }}>
          未找到匹配「{searchQuery}」的链接
        </p>
      </div>
    )
  }

  const mainContent = (
    <div
      className="columns-layout"
      style={{ columns: columnCount, columnGap: '1.5rem' }}
    >
      {showCustomSection && (
        <CategoryBlock
          isCustom
          customLinks={visibleCustom}
          onDeleteCustomLink={onDeleteCustomLink}
          searchQuery={q}
        />
      )}
      {visibleCats.map(cat => (
        <CategoryBlock key={cat.id} cat={cat} searchQuery={q} />
      ))}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4" onClick={checkUnlocked}>
      {activeTab === 'tools' ? (
        <ToolsGate>{mainContent}</ToolsGate>
      ) : (
        mainContent
      )}
    </div>
  )
}
