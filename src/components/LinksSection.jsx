import { useMemo } from 'react'
import { categories } from '../data/links'
import LinkChip from './LinkChip'

const STYLE_COLOR = {
  basic:  '#CCC5CF', blue:   '#90CAF9', green:  '#A5D6A7',
  red:    '#EF9A9A', pink:   '#F48FB1', orange: '#FFCC80',
  teal:   '#80DEEA', violet: '#CE93D8', yellow: '#FFF176',
  wheat:  '#FFE082', brown:  '#BCAAA4', black:  '#BDBDBD',
  grey:   '#E0E0E0', purple: '#CE93D8', blog:   '#9FA8DA',
}
const STYLE_BG = {
  basic:  'rgba(74,69,78,0.38)',    blue:   'rgba(33,150,243,0.16)',
  green:  'rgba(76,175,80,0.16)',   red:    'rgba(244,67,54,0.16)',
  pink:   'rgba(233,30,99,0.16)',   orange: 'rgba(255,152,0,0.16)',
  teal:   'rgba(0,188,212,0.16)',   violet: 'rgba(156,39,176,0.18)',
  yellow: 'rgba(255,235,59,0.14)', wheat:  'rgba(255,193,7,0.16)',
  brown:  'rgba(121,85,72,0.25)',  black:  'rgba(0,0,0,0.40)',
  grey:   'rgba(158,158,158,0.14)', purple: 'rgba(156,39,176,0.16)',
  blog:   'rgba(63,81,181,0.16)',
}

function CustomChip({ link, onDelete }) {
  const bg    = STYLE_BG[link.style]    || STYLE_BG.basic
  const color = STYLE_COLOR[link.style] || STYLE_COLOR.basic

  return (
    <div className="group relative inline-flex">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-chip inline-flex items-center gap-1.5 pl-4 pr-8 py-2 rounded-2xl text-sm font-medium cursor-pointer select-none whitespace-nowrap"
        style={{ background: bg, color }}
      >
        {link.name}
      </a>
      {/* Delete button — visible on hover */}
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

function CategorySection({ cat, searchQuery }) {
  const links = searchQuery
    ? cat.links.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : cat.links

  if (links.length === 0) return null

  return (
    <section className="mb-10 animate-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-1 h-7 rounded-full flex-shrink-0"
          style={{ background: 'linear-gradient(180deg, var(--md-primary), var(--md-tertiary))' }}
        />
        <h2 className="text-xl font-bold" style={{ color: 'var(--md-on-surface)' }}>
          {cat.name}
        </h2>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{
          background: 'var(--md-surface-container-high)',
          color: 'var(--md-on-surface-variant)',
        }}>
          {links.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((link, i) => (
          <LinkChip key={`${link.name}-${link.url}-${i}`} link={link} />
        ))}
      </div>
    </section>
  )
}

export default function LinksSection({ activeTab, searchQuery, customLinks, onDeleteCustomLink }) {
  const q = searchQuery.trim()

  const visibleCustom = useMemo(() => {
    if (!q) return customLinks
    return customLinks.filter(l => l.name.toLowerCase().includes(q.toLowerCase()))
  }, [customLinks, q])

  const visibleCats = useMemo(() => {
    let cats = categories
    if (activeTab !== 'all') cats = cats.filter(c => c.tab === activeTab)
    if (q) {
      cats = cats
        .map(c => ({ ...c, links: c.links.filter(l => l.name.toLowerCase().includes(q.toLowerCase())) }))
        .filter(c => c.links.length > 0)
    }
    return cats
  }, [activeTab, q])

  const hasAny = visibleCustom.length > 0 || visibleCats.length > 0

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

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Custom links section — always at top */}
      {(visibleCustom.length > 0 || (customLinks.length === 0 && activeTab === 'all' && !q)) && (
        <section className="mb-10 animate-slide-up">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-1 h-7 rounded-full flex-shrink-0"
              style={{ background: 'linear-gradient(180deg, var(--md-tertiary), var(--md-primary))' }}
            />
            <h2 className="text-xl font-bold" style={{ color: 'var(--md-on-surface)' }}>
              我的收藏
            </h2>
            {customLinks.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                background: 'var(--md-surface-container-high)',
                color: 'var(--md-on-surface-variant)',
              }}>
                {visibleCustom.length}
              </span>
            )}
          </div>

          {customLinks.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--md-outline)' }}>
              点击右下角的 <strong style={{ color: 'var(--md-primary)' }}>+ 添加自定义链接</strong> 按钮来收藏你常用的网站。链接保存在本地浏览器中。
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {visibleCustom.map(link => (
                <CustomChip key={link.id} link={link} onDelete={onDeleteCustomLink} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Regular categories */}
      {visibleCats.map(cat => (
        <CategorySection key={cat.id} cat={cat} searchQuery={q} />
      ))}
    </div>
  )
}
