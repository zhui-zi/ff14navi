import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import GameInfo from './components/GameInfo'
import TabNav from './components/TabNav'
import LinksSection from './components/LinksSection'
import AddLinkModal from './components/AddLinkModal'
import { tabs } from './data/links'

const STORAGE_KEY = 'ff14navi-custom-links'

function loadCustomLinks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMode, setSearchMode] = useState('site')
  const [activeTab, setActiveTab] = useState('all')
  const [customLinks, setCustomLinks] = useState(loadCustomLinks)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customLinks))
  }, [customLinks])

  const handleExternalSearch = useCallback((query) => {
    if (!query.trim()) return
    const urls = {
      google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
      baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
    }
    if (urls[searchMode]) {
      window.open(urls[searchMode], '_blank', 'noopener,noreferrer')
    }
  }, [searchMode])

  const handleAddLink = useCallback((link) => {
    setCustomLinks(prev => [link, ...prev])
  }, [])

  const handleDeleteLink = useCallback((id) => {
    setCustomLinks(prev => prev.filter(l => l.id !== id))
  }, [])

  const isFiltering = searchMode === 'site' && searchQuery.trim().length > 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--md-surface)', color: 'var(--md-on-surface)' }}>
      <Header />
      <main className="pb-28">
        <SearchBar
          query={searchQuery}
          setQuery={setSearchQuery}
          mode={searchMode}
          setMode={setSearchMode}
          onSearch={handleExternalSearch}
        />
        {!isFiltering && <GameInfo />}
        {!isFiltering && (
          <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        <LinksSection
          activeTab={isFiltering ? 'all' : activeTab}
          searchQuery={searchMode === 'site' ? searchQuery : ''}
          customLinks={customLinks}
          onDeleteCustomLink={handleDeleteLink}
        />
      </main>

      {/* FAB — add custom link */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-bold shadow-2xl z-40"
        style={{
          background: 'var(--md-primary)',
          color: 'var(--md-on-primary)',
          boxShadow: '0 6px 24px rgba(206,180,248,0.35)',
          transition: 'transform 0.2s, filter 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.filter = 'brightness(1.1)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)' }}
        aria-label="添加自定义链接"
      >
        <span className="text-lg leading-none">+</span>
        <span>添加自定义链接</span>
      </button>

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
            href="https://github.com/zhui-zi/ff14navi/pulls"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ background: 'var(--md-primary-container)', color: 'var(--md-on-primary-container)' }}
          >
            <span>🔀</span> 通过 PR 贡献链接
          </a>
        </div>

        <p className="text-sm font-medium mb-2" style={{ color: 'var(--md-on-surface-variant)' }}>
          固执己见的最终幻想14导航站。其中 100% 的代码由 LLM 生成。
        </p>
        <p className="text-xs leading-relaxed max-w-2xl mx-auto opacity-70">
          本站仅作为收录与指引功能，因使用外部程序导致违反相关游戏规定而可能产生的风险，由使用者自负，本站及运营人员对此概不负责。
        </p>
        <p className="text-xs mt-3 opacity-40">FINAL FANTASY XIV © SQUARE ENIX</p>
      </footer>
    </div>
  )
}
