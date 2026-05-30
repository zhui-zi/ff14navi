// ── Brand icons: colored circle badges ──────────────────────────────────────
const BRAND = {
  qq:      { bg: '#12B7F5', color: '#fff', label: 'Q' },
  weibo:   { bg: '#E6162D', color: '#fff', label: '微' },
  youtube: { bg: '#FF0000', color: '#fff', label: '▶' },
  twitter: { bg: '#000000', color: '#fff', label: 'X' },
  reddit:  { bg: '#FF4500', color: '#fff', label: 'R' },
}

// ── Emoji / character icons ──────────────────────────────────────────────────
const EMOJI = {
  globe:         '🌐',
  'shopping cart': '🛒',
  cart:          '🛒',
  database:      '🗄️',
  seedling:      '🌱',
  fish:          '🐟',
  cat:           '🐱',
  sun:           '☀️',
  book:          '📖',
  search:        '🔍',
  home:          '🏠',
  bell:          '🔔',
  clock:         '🕐',
  paw:           '🐾',
  coins:         '🪙',
  donate:        '💝',
  mountain:      '⛰️',
  dice:          '🎲',
  otter:         '🦦',
  tools:         '🔧',
  map:           '🗺️',
  bird:          '🐦',
  shirt:         '👕',
  document:      '📄',
  ban:           '🚫',
  exclamation:   '⚠️',
  calc:          '🧮',
}

function IconEl({ name }) {
  if (!name) return null

  if (BRAND[name]) {
    const b = BRAND[name]
    return (
      <span
        className="flex-shrink-0 inline-flex items-center justify-center rounded-full font-bold leading-none"
        style={{ background: b.bg, color: b.color, width: '1.5em', height: '1.5em', fontSize: '0.6em' }}
        aria-hidden="true"
      >
        {b.label}
      </span>
    )
  }

  const emoji = EMOJI[name]
  if (emoji) {
    return <span className="text-sm leading-none flex-shrink-0" aria-hidden="true">{emoji}</span>
  }

  return null
}

// ── Style → background / text colour ────────────────────────────────────────
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

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-chip inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-medium cursor-pointer select-none whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}
    >
      <IconEl name={link.icon} />
      <span>{link.name}</span>
    </a>
  )
}
