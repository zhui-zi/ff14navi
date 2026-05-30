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


export default function LinkChip({ link }) {
  const styleClass = `chip-${link.style || 'basic'}`

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`link-chip ${styleClass} inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-medium cursor-pointer select-none whitespace-nowrap`}
    >
      <IconEl name={link.icon} />
      <span>{link.name}</span>
    </a>
  )
}
