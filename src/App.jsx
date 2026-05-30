import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import GameInfo from './components/GameInfo'
import TabNav from './components/TabNav'
import LinksSection from './components/LinksSection'
import AddLinkModal from './components/AddLinkModal'
import NewsBoard from './components/NewsBoard'
import { tabs, categories } from './data/links'

const STORAGE_KEY   = 'ff14navi-custom-links'
const COL_KEY       = 'ff14navi-columns'
const THEME_KEY     = 'ff14navi-theme'
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
  try {
    const saved = JSON.parse(localStorage.getItem(CAT_ORDER_KEY))
    if (Array.isArray(saved) && saved.length > 0) return saved
  } catch {}
  return categories.map(c => c.id)
}

function loadDark() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved) return saved === 'dark'
  return true
}

export default function App() {
  const [activeTab, setActiveTab] = useState('all')
  const [customLinks, setCustomLinks] = useState(loadCustomLinks)
  const [showModal, setShowModal]     = useState(false)
  const [columnCount, setColumnCount] = useState(loadColumns)
  const [isDark, setIsDark]           = useState(loadDark)
  const [catOrder, setCatOrder]       = useState(loadCatOrder)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customLinks))
  }, [customLinks])

  useEffect(() => {
    localStorage.setItem(COL_KEY, columnCount)
  }, [columnCount])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('theme-light', !isDark)
  }, [isDark])

  useEffect(() => {
    localStorage.setItem(CAT_ORDER_KEY, JSON.stringify(catOrder))
  }, [catOrder])

  const [flashKey, setFlashKey] = useState(0)
  const toggleTheme = useCallback(() => {
    setIsDark(d => !d)
    setFlashKey(k => k + 1)
  }, [])

const handleAddLink = useCallback((link) => {
    setCustomLinks(prev => [link, ...prev])
  }, [])

  const handleDeleteLink = useCallback((id) => {
    setCustomLinks(prev => prev.filter(l => l.id !== id))
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--md-surface)', color: 'var(--md-on-surface)' }}>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      {flashKey > 0 && <div key={flashKey} className="theme-flash-overlay" aria-hidden="true" />}
      <main className="pb-28">
        <SearchBar />
        <div className="max-w-7xl mx-auto px-4 mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-start">
          <div className="flex-1 min-w-0">
            <GameInfo noWrap />
          </div>
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <NewsBoard noWrap />
          </div>
        </div>
        <TabNav
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          columnCount={columnCount}
          setColumnCount={setColumnCount}
        />
        <LinksSection
          activeTab={activeTab}
          customLinks={customLinks}
          onDeleteCustomLink={handleDeleteLink}
          columnCount={columnCount}
          onOpenAddModal={() => setShowModal(true)}
          catOrder={catOrder}
          setCatOrder={setCatOrder}
        />
      </main>

      {showModal && (
        <AddLinkModal
          onAdd={handleAddLink}
          onClose={() => setShowModal(false)}
        />
      )}

      <footer className="text-center py-10 px-4" style={{ borderTop: '1px solid #201E25', color: 'var(--md-outline)' }}>
        {/* GitHub links */}
        <div className="flex gap-3 justify-center flex-wrap mb-5">
          <a
            href="https://github.com/zhui-zi/ff14navi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ background: 'var(--md-surface-container-high)', color: 'var(--md-on-surface-variant)' }}
          >
            <span>⭐</span> GitHub 仓库
          </a>
          <a
            href="https://github.com/zhui-zi/ff14navi/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ background: 'var(--md-primary-container)', color: 'var(--md-on-primary-container)' }}
          >
            <span>💬</span> 反馈意见
          </a>
        </div>

        <p className="text-sm font-medium mb-2" style={{ color: 'var(--md-on-surface-variant)' }}>
          固执己见的最终幻想14导航站。其中 100% 的代码由 LLM 生成。
        </p>
        <p className="text-xs leading-relaxed max-w-2xl mx-auto opacity-70">
          本站仅作为收录与指引功能，因使用外部程序导致违反相关游戏规定而可能产生的风险，由使用者自负，本站及运营人员对此概不负责。
        </p>
        <p className="text-xs mt-3 opacity-40">FINAL FANTASY XIV © SQUARE ENIX</p>
        <p className="text-xs mt-4 opacity-50">
          Built with React · Powered by Cloudflare Pages ·{' '}
          <a
            href="https://keita.cc/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            黑川启太
          </a>
        </p>
      </footer>
    </div>
  )
}
