const ICON_MAP = {
  globe:      '🌐',
  'shopping cart': '🛒',
  cart:       '🛒',
  weibo:      '微',
  youtube:    '▶',
  twitter:    '𝕏',
  database:   '🗄',
  seedling:   '🌱',
  fish:       '🐟',
  cat:        '🐱',
  sun:        '☀',
  book:       '📖',
  search:     '🔍',
  home:       '🏠',
  bell:       '🔔',
  clock:      '🕐',
  paw:        '🐾',
  coins:      '🪙',
  donate:     '💝',
  mountain:   '⛰',
  dice:       '🎲',
  otter:      '🦦',
  tools:      '🔧',
  map:        '🗺',
  bird:       '🐦',
  shirt:      '👕',
  document:   '📄',
  ban:        '🚫',
  exclamation: '⚠',
  mod:        'MOD',
  reddit:     'r/',
  qq:         'QQ',
  calc:       '🧮',
}

const STYLE = {
  blue:   { bg: 'rgba(33,150,243,0.16)',  text: '#90CAF9' },
  green:  { bg: 'rgba(76,175,80,0.16)',   text: '#A5D6A7' },
  red:    { bg: 'rgba(244,67,54,0.16)',   text: '#EF9A9A' },
  pink:   { bg: 'rgba(233,30,99,0.16)',   text: '#F48FB1' },
  orange: { bg: 'rgba(255,152,0,0.16)',   text: '#FFCC80' },
  teal:   { bg: 'rgba(0,188,212,0.16)',   text: '#80DEEA' },
  violet: { bg: 'rgba(156,39,176,0.18)',  text: '#CE93D8' },
  olive:  { bg: 'rgba(139,195,74,0.16)',  text: '#DCE775' },
  yellow: { bg: 'rgba(255,235,59,0.14)',  text: '#FFF176' },
  wheat:  { bg: 'rgba(255,193,7,0.16)',   text: '#FFE082' },
  brown:  { bg: 'rgba(121,85,72,0.25)',   text: '#BCAAA4' },
  black:  { bg: 'rgba(0,0,0,0.40)',       text: '#BDBDBD' },
  grey:   { bg: 'rgba(158,158,158,0.14)', text: '#E0E0E0' },
  purple: { bg: 'rgba(156,39,176,0.16)',  text: '#CE93D8' },
  basic:  { bg: 'rgba(74,69,78,0.38)',    text: '#CCC5CF' },
  blog:   { bg: 'rgba(63,81,181,0.16)',   text: '#9FA8DA' },
}

export default function LinkChip({ link }) {
  const s = STYLE[link.style] || STYLE.basic
  const icon = link.icon ? ICON_MAP[link.icon] : null

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-chip inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-medium cursor-pointer select-none whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}
    >
      {icon && (
        <span className="text-sm leading-none flex-shrink-0" aria-hidden="true">{icon}</span>
      )}
      <span>{link.name}</span>
    </a>
  )
}
