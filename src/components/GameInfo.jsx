const CARDS = [
  {
    emoji: '🎮',
    label: '当前资料片',
    title: '黎明之晓',
    sub: 'Dawntrail · Patch 7.x',
    bg: 'linear-gradient(135deg, #3D1B72, #553387)',
    url: 'https://ff.web.sdo.com/web8/index.html#/index',
  },
  {
    emoji: '📜',
    label: '版本更新',
    title: '查看最新补丁说明',
    sub: '点击跳转国服官网',
    bg: 'linear-gradient(135deg, #5C3F00, #7A5500)',
    url: 'https://ff.web.sdo.com/web8/index.html#/topic/pageList/id/173',
  },
  {
    emoji: '🎪',
    label: '活动日历',
    title: '当前进行中活动',
    sub: '国服官方活动页面',
    bg: 'linear-gradient(135deg, #005065, #00718E)',
    url: 'https://ff.web.sdo.com/web8/index.html#/topic/pageList/id/169',
  },
  {
    emoji: '🗺',
    label: '国际服日志',
    title: 'Lodestone',
    sub: '新闻 · 维护 · 活动',
    bg: 'linear-gradient(135deg, #1A3A6E, #1E4D94)',
    url: 'https://jp.finalfantasyxiv.com/lodestone/',
  },
  {
    emoji: '⚔',
    label: '国际服官网',
    title: 'FINAL FANTASY XIV',
    sub: 'finalfantasyxiv.com',
    bg: 'linear-gradient(135deg, #2A1A4A, #3D2666)',
    url: 'https://www.finalfantasyxiv.com/',
  },
]

export default function GameInfo() {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CARDS.map((card, i) => (
          <a
            key={i}
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-3 px-5 py-4 rounded-3xl cursor-pointer"
            style={{
              background: card.bg,
              minWidth: '210px',
              transition: 'transform 0.2s, filter 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.filter = 'brightness(1.15)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)' }}
          >
            <span className="text-3xl leading-none">{card.emoji}</span>
            <div className="min-w-0">
              <div className="text-xs font-medium mb-0.5 opacity-70" style={{ color: '#EDD9FF' }}>
                {card.label}
              </div>
              <div className="text-sm font-bold truncate" style={{ color: '#EDD9FF' }}>
                {card.title}
              </div>
              <div className="text-xs opacity-55 truncate" style={{ color: '#EDD9FF' }}>
                {card.sub}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
