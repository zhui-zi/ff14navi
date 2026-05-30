import { useMemo } from 'react'
import { categories } from '../data/links'
import LinkChip from './LinkChip'

export default function LinksSection({ activeTab, searchQuery }) {
  const visible = useMemo(() => {
    let cats = categories

    if (activeTab !== 'all') {
      cats = cats.filter(c => c.tab === activeTab)
    }

    const q = searchQuery.trim().toLowerCase()
    if (q) {
      cats = cats
        .map(c => ({ ...c, links: c.links.filter(l => l.name.toLowerCase().includes(q)) }))
        .filter(c => c.links.length > 0)
    }

    return cats
  }, [activeTab, searchQuery])

  if (visible.length === 0) {
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
      {visible.map(cat => (
        <section key={cat.id} className="mb-10 animate-slide-up">
          {/* Category header */}
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
              {cat.links.length}
            </span>
          </div>

          {/* Link chips */}
          <div className="flex flex-wrap gap-2">
            {cat.links.map((link, i) => (
              <LinkChip key={`${link.name}-${link.url}-${i}`} link={link} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
