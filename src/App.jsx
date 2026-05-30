import { useState, useCallback } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import GameInfo from './components/GameInfo'
import TabNav from './components/TabNav'
import LinksSection from './components/LinksSection'
import { tabs } from './data/links'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMode, setSearchMode] = useState('site')
  const [activeTab, setActiveTab] = useState('all')

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

  const isFiltering = searchMode === 'site' && searchQuery.trim().length > 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--md-surface)', color: 'var(--md-on-surface)' }}>
      <Header />
      <main className="pb-20">
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
        />
      </main>
      <footer className="text-center py-10 px-4" style={{ borderTop: '1px solid #201E25', color: 'var(--md-outline)' }}>
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
