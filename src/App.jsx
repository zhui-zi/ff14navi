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
      <footer className="text-center py-8" style={{ borderTop: '1px solid #201E25', color: 'var(--md-outline)' }}>
        <p className="text-sm tracking-wider">艾欧泽亚导航 · 非官方粉丝导航站 · 仅供参考</p>
        <p className="text-xs mt-1 opacity-60">FINAL FANTASY XIV © SQUARE ENIX</p>
      </footer>
    </div>
  )
}
