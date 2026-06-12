import { useState, useCallback, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import DashboardSection from './components/DashboardSection'
import TabNav from './components/TabNav'
import LinksSection from './components/LinksSection'
import AddLinkModal from './components/AddLinkModal'
import { tabs, categories } from './data/links'

const STORAGE_KEY   = 'ff14navi-custom-links'
const COL_KEY       = 'ff14navi-columns'
const CAT_ORDER_KEY = 'ff14navi-cat-order'

function loadCustomLinks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadColumns() {
  const v = parseInt(localStorage.getItem(COL_KEY), 10)
  return v >= 1 && v <= 4 ? v : 2
}

function loadCatOrder() {
  const allIds = categories.map(c => c.id)
  try {
    const saved = JSON.parse(localStorage.getItem(CAT_ORDER_KEY))
    if (Array.isArray(saved) && saved.length > 0) {
      const missing = allIds.filter(id => !saved.includes(id))
      if (missing.length === 0) return saved
      const result = [...saved]
      for (const id of missing) {
        const nat = allIds.indexOf(id)
        let pos = result.length
        for (let i = nat - 1; i >= 0; i--) {
          const p = result.indexOf(allIds[i])
          if (p !== -1) { pos = p + 1; break }
        }
        result.splice(pos, 0, id)
      }
      return result
    }
  } catch {}
  return allIds
}

export default function App() {
  const { pref, effective, cycle, palette, setPalette } = useTheme()
  const [activeTab, setActiveTab]     = useState('all')
  const [customLinks, setCustomLinks] = useState(loadCustomLinks)
  const [showModal, setShowModal]     = useState(false)
  const [columnCount, setColumnCount] = useState(loadColumns)
  const [catOrder, setCatOrder]       = useState(loadCatOrder)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customLinks))
  }, [customLinks])

  useEffect(() => {
    localStorage.setItem(COL_KEY, columnCount)
  }, [columnCount])

  useEffect(() => {
    localStorage.setItem(CAT_ORDER_KEY, JSON.stringify(catOrder))
  }, [catOrder])

  useEffect(() => {
    const allIds = categories.map(c => c.id)
    const hasMissing = allIds.some(id => !catOrder.includes(id))
    if (hasMissing) setCatOrder(loadCatOrder())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isSorting, setIsSorting] = useState(false)
  const [linkSort,  setLinkSort]  = useState('default')
  useEffect(() => { setIsSorting(false) }, [activeTab])

  const resetCatOrder = useCallback(() => {
    setCatOrder(categories.map(c => c.id))
  }, [])

  const handleAddLink = useCallback((link) => {
    setCustomLinks(prev => [link, ...prev])
  }, [])

  const handleDeleteLink = useCallback((id) => {
    setCustomLinks(prev => prev.filter(l => l.id !== id))
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--md-surface)', color: 'var(--md-on-surface)' }}>
      <Header
        themePref={pref}
        themeEffective={effective}
        onCycleTheme={cycle}
        palette={palette}
        onSetPalette={setPalette}
      />
      <main className="pb-28">
        <SearchBar />
        <DashboardSection />
        <TabNav
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          columnCount={columnCount}
          setColumnCount={setColumnCount}
          isSorting={isSorting}
          setIsSorting={setIsSorting}
          onResetCatOrder={resetCatOrder}
          linkSort={linkSort}
          onToggleLinkSort={() => setLinkSort(s => s === 'default' ? 'alpha' : 'default')}
        />
        <LinksSection
          activeTab={activeTab}
          customLinks={customLinks}
          onDeleteCustomLink={handleDeleteLink}
          columnCount={columnCount}
          onOpenAddModal={() => setShowModal(true)}
          catOrder={catOrder}
          setCatOrder={setCatOrder}
          isSorting={isSorting}
          linkSort={linkSort}
        />
      </main>

      {showModal && (
        <AddLinkModal
          onAdd={handleAddLink}
          onClose={() => setShowModal(false)}
        />
      )}

      <footer style={{ background: 'var(--md-surface-container)', marginTop: '1rem' }}>
        {/* Accent strip — mirrors header bottom strip */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, var(--md-primary) 30%, var(--md-tertiary) 60%, transparent 100%)',
          opacity: 0.3,
        }} />

        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2.25rem 1rem 2rem', textAlign: 'center' }}>

          {/* Brand mark */}
          <div style={{ marginBottom: '0.625rem' }}>
            <span style={{
              fontFamily: '"Noto Serif SC", serif',
              fontWeight: 900,
              fontSize: '1.05rem',
              letterSpacing: '-0.01em',
              background: 'linear-gradient(135deg, var(--md-primary) 0%, var(--md-tertiary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              背水咖啡厅
            </span>
          </div>

          {/* Tagline */}
          <p style={{
            fontSize: '0.75rem', fontWeight: 500,
            color: 'var(--md-on-surface-variant)',
            opacity: 'var(--t-secondary)',
            letterSpacing: '0.04em',
            marginBottom: '1.375rem',
          }}>
            固执己见的最终幻想14导航站 · 100% LLM generated
          </p>

          {/* M3 filled-tonal chip links */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[
              { label: '黑川启太', href: 'https://keita.cc/', icon: '✦' },
              { label: 'GitHub', href: 'https://github.com/zhui-zi/ff14navi', icon: null, svgPath: 'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  background: 'var(--md-primary-container)',
                  border: '1.5px solid color-mix(in srgb, var(--md-primary) 25%, var(--md-outline-variant))',
                  color: 'var(--md-on-primary-container)',
                  fontSize: '0.75rem', fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background 0.18s ease, transform 0.18s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'color-mix(in srgb, var(--md-primary-container) 85%, var(--md-primary))'; e.currentTarget.style.transform = 'scale(1.04)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--md-primary-container)'; e.currentTarget.style.transform = 'scale(1)' }}
              >
                {item.svgPath ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.75 }}>
                    <path d={item.svgPath} />
                  </svg>
                ) : (
                  <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>{item.icon}</span>
                )}
                {item.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p style={{ fontSize: '0.68rem', color: 'var(--md-outline)', opacity: 'var(--t-ghost)', marginBottom: '0.2rem' }}>
            FINAL FANTASY XIV © SQUARE ENIX CO., LTD.
          </p>
          <p style={{ fontSize: '0.65rem', color: 'var(--md-outline)', opacity: 'var(--t-ghost)' }}>
            Built with React · Powered by Cloudflare Pages
          </p>

        </div>
      </footer>
    </div>
  )
}
