import { useMemo, useState, useCallback, useEffect } from 'react'
import { categories } from '../data/links'
import LinkChip from './LinkChip'
import ToolsGate from './ToolsGate'

const TOOLS_KEY = 'ff14navi-tools-unlocked'

function CustomChip({ link, onDelete, editMode }) {
  const styleClass = `chip-${link.style || 'basic'}`
  return (
    <div className="inline-flex items-center gap-1">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`link-chip ${styleClass} inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-medium cursor-pointer select-none whitespace-nowrap`}
      >
        {link.name}
      </a>
      {editMode && (
        <button
          onClick={() => onDelete(link.id)}
          className="w-5 h-5 flex items-center justify-center rounded-full text-xs flex-shrink-0 transition-colors duration-150"
          style={{ background: 'var(--md-surface-container-highest)', color: 'var(--md-on-surface-variant)' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#EF9A9A33'; e.currentTarget.style.color = '#EF9A9A' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--md-surface-container-highest)'; e.currentTarget.style.color = 'var(--md-on-surface-variant)' }}
          aria-label="删除"
          title="删除此链接"
        >
          ✕
        </button>
      )}
    </div>
  )
}

function SortButtons({ isFirst, isLast, onMoveUp, onMoveDown }) {
  const base = 'w-7 h-7 flex items-center justify-center rounded-lg text-base font-bold transition-colors'
  return (
    <div className="flex gap-1 ml-auto flex-shrink-0">
      <button
        onClick={onMoveUp}
        disabled={isFirst}
        className={base}
        style={isFirst
          ? { color: 'var(--md-outline)', opacity: 0.25, cursor: 'not-allowed' }
          : { background: 'var(--md-surface-container-highest)', color: 'var(--md-on-surface)' }}
        title="上移"
      >↑</button>
      <button
        onClick={onMoveDown}
        disabled={isLast}
        className={base}
        style={isLast
          ? { color: 'var(--md-outline)', opacity: 0.25, cursor: 'not-allowed' }
          : { background: 'var(--md-surface-container-highest)', color: 'var(--md-on-surface)' }}
        title="下移"
      >↓</button>
    </div>
  )
}

function CategoryBlock({ cat, isCustom, customLinks, onDeleteCustomLink, onOpenAddModal, isSorting, isFirst, isLast, onMoveUp, onMoveDown, linkSort }) {
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (isSorting || customLinks?.length === 0) setEditMode(false)
  }, [isSorting, customLinks?.length])

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
          {isSorting ? (
            <span className="ml-auto text-xs px-2 py-1 rounded"
              style={{ color: 'var(--md-outline)', background: 'var(--md-surface-container)' }}>
              固定置顶
            </span>
          ) : (
            <div className="ml-auto flex items-center gap-1 p-1 rounded-full"
              style={{ background: 'var(--md-surface-container)', border: '1px solid var(--md-outline-variant)' }}>
              {customLinks.length > 0 && (
                <button
                  onClick={() => setEditMode(v => !v)}
                  className="text-xs px-3 h-8 rounded-full font-medium transition-all duration-150"
                  style={editMode
                    ? { background: 'var(--md-primary)', color: 'var(--md-on-primary)', fontWeight: 600 }
                    : { color: 'var(--md-on-surface-variant)' }}
                  onMouseEnter={e => { if (!editMode) e.currentTarget.style.background = 'var(--md-surface-container-high)' }}
                  onMouseLeave={e => { if (!editMode) e.currentTarget.style.background = '' }}
                >
                  {editMode ? '完成' : '管理'}
                </button>
              )}
              {!editMode && (
                <button
                  onClick={onOpenAddModal}
                  className="flex items-center gap-1 px-3 h-8 rounded-full text-sm font-bold transition-all duration-150"
                  style={{ background: 'var(--md-primary)', color: 'var(--md-on-primary)' }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.filter = '' }}
                >
                  <span className="text-base leading-none">+</span>
                  <span>添加</span>
                </button>
              )}
            </div>
          )}
        </div>
        {customLinks.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--md-outline)' }}>
            点击右上角 <strong style={{ color: 'var(--md-primary)' }}>+ 添加</strong> 收藏常用网站，数据保存在本地浏览器。
          </p>
        ) : (
          <div className="flex flex-wrap gap-2" style={isSorting ? { opacity: 0.35, pointerEvents: 'none' } : {}}>
            {(linkSort === 'alpha' ? [...customLinks].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')) : customLinks).map(link => (
              <CustomChip key={link.id} link={link} onDelete={onDeleteCustomLink} editMode={editMode} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const links = linkSort === 'alpha'
    ? [...cat.links].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    : cat.links
  if (links.length === 0) return null

  return (
    <div
      className="category-block"
      style={isSorting ? {
        outline: '1px dashed var(--md-outline-variant)',
        outlineOffset: '8px',
        borderRadius: '4px',
      } : {}}
    >
      <div className="flex items-center gap-3 mb-4">
        {isSorting ? (
          <span className="text-lg leading-none select-none flex-shrink-0"
            style={{ color: 'var(--md-outline)', letterSpacing: '-2px' }}>
            ⠿
          </span>
        ) : (
          <div className="w-1 h-7 rounded-full flex-shrink-0"
            style={{ background: 'linear-gradient(180deg, var(--md-primary), var(--md-tertiary))' }} />
        )}
        <h2 className="text-xl font-bold" style={{ color: 'var(--md-on-surface)' }}>{cat.name}</h2>
        <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'var(--md-surface-container-high)', color: 'var(--md-on-surface-variant)' }}>
          {links.length}
        </span>
        {isSorting && (
          <SortButtons
            isFirst={isFirst}
            isLast={isLast}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2" style={isSorting ? { opacity: 0.35, pointerEvents: 'none' } : {}}>
        {links.map((link, i) => (
          <LinkChip key={`${link.name}-${link.url}-${i}`} link={link} />
        ))}
      </div>
    </div>
  )
}

export default function LinksSection({ activeTab, customLinks, onDeleteCustomLink, columnCount, onOpenAddModal, catOrder, setCatOrder, isSorting, linkSort }) {
  const [toolsUnlocked, setToolsUnlocked] = useState(() => !!localStorage.getItem(TOOLS_KEY))

  const checkUnlocked = () => {
    if (!toolsUnlocked && localStorage.getItem(TOOLS_KEY)) setToolsUnlocked(true)
  }

  const visibleCats = useMemo(() => {
    let cats
    if (activeTab !== 'all') {
      cats = categories.filter(c => c.tab === activeTab)
    } else {
      cats = toolsUnlocked ? categories : categories.filter(c => c.tab !== 'tools')
    }
    return [...cats].sort((a, b) => {
      const ai = catOrder.indexOf(a.id)
      const bi = catOrder.indexOf(b.id)
      if (ai === -1 && bi === -1) return 0
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
  }, [activeTab, toolsUnlocked, catOrder])

  const handleMove = useCallback((catId, dir) => {
    const idx = visibleCats.findIndex(c => c.id === catId)
    if (idx < 0) return
    const neighborIdx = idx + dir
    if (neighborIdx < 0 || neighborIdx >= visibleCats.length) return
    const neighborId = visibleCats[neighborIdx].id
    setCatOrder(prev => {
      const order = [...prev]
      const ai = order.indexOf(catId)
      const bi = order.indexOf(neighborId)
      if (ai >= 0 && bi >= 0) [order[ai], order[bi]] = [order[bi], order[ai]]
      return order
    })
  }, [visibleCats, setCatOrder])

  const showCustomSection = activeTab === 'all'
  const effectiveColumns = isSorting ? 1 : columnCount

  const mainContent = (
    <div
        key={activeTab}
        className="columns-layout"
        style={{ columns: effectiveColumns, columnGap: '1.5rem' }}
      >
        {showCustomSection && (
          <CategoryBlock
            isCustom
            customLinks={customLinks}
            onDeleteCustomLink={onDeleteCustomLink}
            onOpenAddModal={onOpenAddModal}
            isSorting={isSorting}
            linkSort={linkSort}
          />
        )}
        {visibleCats.map((cat, idx) => (
          <CategoryBlock
            key={cat.id}
            cat={cat}
            isSorting={isSorting}
            isFirst={idx === 0}
            isLast={idx === visibleCats.length - 1}
            onMoveUp={() => handleMove(cat.id, -1)}
            onMoveDown={() => handleMove(cat.id, 1)}
            linkSort={linkSort}
          />
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
