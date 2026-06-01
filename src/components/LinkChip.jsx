// ── Real brand SVG icons (Simple Icons, MIT license) ────────────────────────
// Each has { color, svg: JSX }
const BRAND = {
  qq: {
    color: '#12B7F5',
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#12B7F5" aria-hidden="true">
        <path d="M12.003 2C6.627 2 2.003 6.623 2.003 12s4.624 10 10 10 10-4.623 10-10S17.379 2 12.003 2zm3.86 14.83c-.17.172-.446.266-.787.266-.404 0-.815-.127-1.118-.385l-1.955-1.666-1.956 1.666c-.303.258-.714.385-1.118.385-.34 0-.616-.094-.787-.266-.353-.355-.293-.983.11-1.408l2.23-2.25H8.26c-.65 0-.946-.25-.946-.638 0-.342.315-.57.946-.57h3.222V11.55H8.26c-.65 0-.946-.25-.946-.638 0-.342.315-.57.946-.57h1.91l-2.25-1.95a.782.782 0 0 1-.23-.578c0-.37.212-.69.512-.823l.002-.001c.11-.048.226-.072.35-.072.253 0 .498.103.681.286l3.772 3.415 3.77-3.415a.955.955 0 0 1 .683-.286c.122 0 .238.024.35.072.298.134.51.453.51.823 0 .21-.082.413-.228.578l-2.25 1.95h1.91c.65 0 .946.228.946.57 0 .388-.297.638-.946.638h-3.223v.414h3.223c.65 0 .946.228.946.57 0 .388-.297.638-.946.638h-2.224l2.23 2.25c.403.425.463 1.053.11 1.408z" />
      </svg>
    ),
  },
  youtube: {
    color: '#FF0000',
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#FF0000" d="M23.495 6.204a3.008 3.008 0 0 0-2.088-2.088C19.539 3.6 12 3.6 12 3.6s-7.539 0-9.407.516a3.008 3.008 0 0 0-2.088 2.088C0 8.14 0 12 0 12s0 3.86.505 5.796a3.008 3.008 0 0 0 2.088 2.088C4.461 20.4 12 20.4 12 20.4s7.539 0 9.407-.516a3.008 3.008 0 0 0 2.088-2.088C24 15.86 24 12 24 12s0-3.86-.505-5.796z" />
        <path fill="white" d="M9.545 15.568V8.432L15.818 12z" />
      </svg>
    ),
  },
  twitter: {
    color: '#000000',
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  reddit: {
    color: '#FF4500',
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <circle fill="#FF4500" cx="12" cy="12" r="12" />
        <path fill="white" d="M20.187 12c0-.94-.76-1.7-1.698-1.7-.46 0-.878.185-1.189.483-1.168-.84-2.779-1.38-4.565-1.44l.777-3.648 2.528.538a1.2 1.2 0 1 0 1.24-1.198 1.2 1.2 0 0 0-1.079.67l-2.823-.6a.173.173 0 0 0-.204.13l-.87 4.07c-1.8.056-3.424.596-4.598 1.44a1.67 1.67 0 0 0-1.185-.483A1.7 1.7 0 0 0 4.824 12c0 .616.332 1.15.824 1.44a3.342 3.342 0 0 0-.04.492c0 2.503 2.914 4.532 6.511 4.532 3.597 0 6.511-2.029 6.511-4.532a3.4 3.4 0 0 0-.04-.492A1.7 1.7 0 0 0 20.187 12zm-11.25 1.1a1.2 1.2 0 1 1 2.4 0 1.2 1.2 0 0 1-2.4 0zm6.698 3.18a3.878 3.878 0 0 1-2.516.796 3.878 3.878 0 0 1-2.515-.796.303.303 0 0 1 .42-.437c.552.52 1.313.793 2.095.793s1.543-.273 2.096-.793a.303.303 0 0 1 .42.437zm.152-1.98a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z" />
      </svg>
    ),
  },
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
  weibo:         '🐦',
  calc:          '🧮',
  star:          '🌠',
}

function IconEl({ name }) {
  if (!name) return null
  if (BRAND[name]) {
    return <span className="flex-shrink-0 leading-none">{BRAND[name].svg}</span>
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
