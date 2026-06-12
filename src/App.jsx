import { useState, useCallback, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import GameInfo from './components/GameInfo'
import TabNav from './components/TabNav'
import LinksSection from './components/LinksSection'
import AddLinkModal from './components/AddLinkModal'
import NewsBoard from './components/NewsBoard'
import DailyFortune from './components/DailyFortune'
import FrontlineSchedule from './components/FrontlineSchedule'
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
      // For each new category, search backward through its natural neighbors to find
      // the closest preceding sibling already in the saved order, then insert after it.
      // This keeps user-customized ordering intact while slotting new categories naturally.
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
  const { pref, effective, cycle } = useTheme()
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

  // Sync catOrder if new categories were added since last visit
  useEffect(() => {
    const allIds = categories.map(c => c.id)
    const hasMissing = allIds.some(id => !catOrder.includes(id))
    if (hasMissing) setCatOrder(loadCatOrder())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isSorting,  setIsSorting]  = useState(false)
  const [linkSort,   setLinkSort]   = useState('default')
  // Reset sort mode on tab switch so each tab always opens in its default view
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
      <Header themePref={pref} themeEffective={effective} onCycleTheme={cycle} />
      <main className="pb-28">
        <SearchBar />
        {/* Game info: version banner + activity cards + predictions strip */}
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <GameInfo noWrap />
        </div>

        {/* Info widgets row: news | fortune | frontline */}
        <div className="max-w-7xl mx-auto px-4 mb-6 flex flex-col lg:flex-row gap-4 items-start">
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
            <NewsBoard noWrap />
          </div>
          <div className="flex-1 min-w-0">
            <DailyFortune noWrap />
          </div>
          <div className="w-full lg:w-56 xl:w-64 flex-shrink-0">
            <FrontlineSchedule noWrap />
          </div>
        </div>
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

      <footer className="text-center py-10 px-4" style={{ borderTop: '1px solid var(--md-outline-variant)', color: 'var(--md-outline)' }}>
        <p className="text-sm font-medium mb-4" style={{ color: 'var(--md-on-surface-variant)' }}>
          固执己见的最终幻想14导航站。其中 100% 的代码由 LLM 生成。
        </p>
        <p className="text-xs opacity-35 mb-2">FINAL FANTASY XIV © SQUARE ENIX</p>
        <p className="text-xs opacity-45 leading-relaxed">
          Built with React · Powered by Cloudflare Pages ·{' '}
          <a href="https://keita.cc/" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            黑川启太
          </a>
          {' '}·{' '}
          <a href="https://github.com/zhui-zi/ff14navi" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
