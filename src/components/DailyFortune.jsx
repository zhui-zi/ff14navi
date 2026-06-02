import { useMemo, useState } from 'react'

// Mulberry32 seeded PRNG
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h >>> 0
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)]
}

function pickWeighted(rand, arr) {
  const total = arr.reduce((s, x) => s + x.w, 0)
  let r = rand() * total
  for (const x of arr) { r -= x.w; if (r <= 0) return x }
  return arr[arr.length - 1]
}

// ── Data ────────────────────────────────────────────────────────────────────

const JOBS = [
  { name: '骑士',    role: 'tank',    color: '#64B5F6' },
  { name: '战士',    role: 'tank',    color: '#EF9A9A' },
  { name: '暗黑骑士', role: 'tank',    color: '#CE93D8' },
  { name: '绝枪战士', role: 'tank',    color: '#90A4AE' },
  { name: '白魔法师', role: 'healer',  color: '#E0E0E0' },
  { name: '学者',    role: 'healer',  color: '#7986CB' },
  { name: '占星术士', role: 'healer',  color: '#FFD54F' },
  { name: '贤者',    role: 'healer',  color: '#4DD0E1' },
  { name: '武僧',    role: 'melee',   color: '#FF8A65' },
  { name: '龙骑士',  role: 'melee',   color: '#5C9BD6' },
  { name: '忍者',    role: 'melee',   color: '#78909C' },
  { name: '武士',    role: 'melee',   color: '#EF5350' },
  { name: '钐镰客',  role: 'melee',   color: '#B0BEC5' },
  { name: '蝰蛇剑士', role: 'melee',   color: '#81C784' },
  { name: '吟游诗人', role: 'ranged',  color: '#AED581' },
  { name: '机工士',  role: 'ranged',  color: '#FFA726' },
  { name: '舞者',    role: 'ranged',  color: '#F48FB1' },
  { name: '黑魔法师', role: 'caster',  color: '#9575CD' },
  { name: '召唤师',  role: 'caster',  color: '#66BB6A' },
  { name: '赤魔法师', role: 'caster',  color: '#EF5350' },
  { name: '绘灵法师', role: 'caster',  color: '#FF8A65' },
]

const ROLE_LABEL = { tank: '坦克', healer: '治疗', melee: '近战', ranged: '远程', caster: '法系' }

const ELEMENTS = [
  { name: '风', sym: '🌿', color: '#81C784' },
  { name: '火', sym: '🔥', color: '#FF7043' },
  { name: '冰', sym: '❄️', color: '#4FC3F7' },
  { name: '土', sym: '🪨', color: '#A1887F' },
  { name: '雷', sym: '⚡', color: '#CE93D8' },
  { name: '水', sym: '💧', color: '#42A5F5' },
  { name: '光', sym: '✨', color: '#FFF176' },
  { name: '暗', sym: '🌑', color: '#7E57C2' },
]

const LEVELS = [
  { label: '大吉', color: '#FFD700', w: 1 },
  { label: '吉',   color: '#81C784', w: 3 },
  { label: '中吉', color: '#4FC3F7', w: 3 },
  { label: '小吉', color: '#CE93D8', w: 3 },
  { label: '末吉', color: '#FFB74D', w: 2 },
  { label: '凶',   color: '#EF5350', w: 1 },
]

const TEXTS = {
  '大吉': [
    '以太结晶共鸣强烈，诸事皆宜。今日挑战高难度副本，装备必有落地。',
    '命星高照，光之战士的力量今日达到顶峰。组队开荒，胜率极高。',
    '星盘呈大吉之象，幸运与你同行。无论副本还是制作，皆可全力以赴。',
  ],
  '吉': [
    '以太流动顺畅，队友配合和谐。适合约上好友共同攻略，其乐融融。',
    '光之战士气场强盛，今日冒险顺利。挑战稍有难度的内容，胜算颇高。',
    '星象呈吉，行事宜积极。今日与同伴并肩作战，必能留下美好回忆。',
  ],
  '中吉': [
    '迷宫之神微微点头，以太流动平稳。稳健行事，细心操作可弥补运气不足。',
    '命运的天平倾向光明，发挥稳定即可收获不错的成果。不宜急功近利。',
    '星命平稳，今日适合规律地完成日常任务，积少成多，稳步前行。',
  ],
  '小吉': [
    '命星若隐若现，小有收获，享受过程比追求结果更重要。',
    '以太波动轻微，适合轻松的游玩内容，不宜强行挑战高难度副本。',
    '今日运势平平中带一丝惊喜，保持平常心，意外的好事或许悄然而至。',
  ],
  '末吉': [
    '命星偏低，低调行事为佳。避免冲动消费 Gil，量力而为。',
    '以太略显浑浊，今日挑战不顺宜及时收手，留得青山在，不愁没柴烧。',
    '星象提示谨慎，减少不必要的风险。整理仓库或陪友人闲逛或许更惬意。',
  ],
  '凶': [
    '今日星象不佳，小心掉线与深渊。备份宏设置，提前储备回复药水。',
    '命星隐于云翳，诸事多磨。凶中有转机——挺过难关或有意外惊喜等候。',
    '以太共鸣失调，行事宜三思而后行。低难度内容入手，切勿仓促开荒。',
  ],
}

const ACTIVITIES = [
  '挑战高难副本', '精心制作装备', '采集珍稀材料',
  '漫步金碟嘉年华', '组队讨伐极神', '探索未知地图',
  '完成好感度剧情', 'PvP争锋称雄', '悠然垂钓修心',
  '精心装修雅居', '收集成就勋章', '挑战零式排名',
  '完成每周常规', '约好友一起玩', '解锁新职业技能',
  '刷取幻化收藏', '参加限时活动', '完成九宫幻卡',
]

// ── Logic ────────────────────────────────────────────────────────────────────

const REVEALED_KEY   = 'ff14navi-fortune-revealed'
const USER_TOKEN_KEY = 'ff14navi-fortune-token'

function getUserToken() {
  let token = localStorage.getItem(USER_TOKEN_KEY)
  if (!token) {
    token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    localStorage.setItem(USER_TOKEN_KEY, token)
  }
  return token
}

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function loadRevealed() {
  try {
    const raw = localStorage.getItem(REVEALED_KEY)
    if (!raw) return false
    const { date } = JSON.parse(raw)
    return date === getTodayStr()
  } catch { return false }
}

function saveRevealed() {
  localStorage.setItem(REVEALED_KEY, JSON.stringify({ date: getTodayStr() }))
}

function buildFortune() {
  const dateStr = getTodayStr()
  const token   = getUserToken()
  const rand    = mulberry32(hashStr(dateStr + token))

  const level    = pickWeighted(rand, LEVELS)
  const job      = pick(rand, JOBS)
  const element  = pick(rand, ELEMENTS)
  const activity = pick(rand, ACTIVITIES)
  const texts    = TEXTS[level.label]
  const text     = pick(rand, texts)
  const luckyNum = Math.floor(rand() * 9) + 1

  return { dateStr, level, job, element, activity, text, luckyNum }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function DailyFortune({ noWrap = false }) {
  const [revealed, setRevealed] = useState(loadRevealed)
  const fortune = useMemo(() => buildFortune(), [])

  function handleReveal() {
    setRevealed(true)
    saveRevealed()
  }

  const accent = fortune.level.color

  const content = (
    <div
      className="rounded-2xl overflow-hidden h-full flex flex-col"
      style={{
        background: 'var(--md-surface-container)',
        border: `2px solid ${accent}50`,
        borderLeftWidth: '4px',
        borderLeftColor: accent,
        position: 'relative',
      }}
    >

      {/* Header bar */}
      <div
        className="relative flex items-center justify-between px-5 py-2.5"
        style={{ borderBottom: `1px solid ${accent}30` }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--md-primary)', opacity: 0.7, fontSize: '0.75rem' }}>✦</span>
          <span className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--md-on-surface-variant)', letterSpacing: '0.15em' }}>
            每日运势
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--md-outline)', opacity: 0.6 }}>
          {fortune.dateStr}
        </span>
      </div>

      {!revealed ? (
        /* ── Unrevealed state ── */
        <button
          className="relative flex-1 w-full flex flex-col items-center justify-center gap-3 px-5"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          onClick={handleReveal}
        >
          <div style={{ fontSize: '2.4rem', lineHeight: 1 }}>🔮</div>
          <div className="text-sm font-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
            点击占卜今日运势
          </div>
          <div className="text-xs" style={{ color: 'var(--md-outline)', opacity: 0.5 }}>
            每日重置 · 每位冒险者独享专属运势
          </div>
        </button>
      ) : (
        /* ── Revealed state ── */
        <div className="relative flex flex-col flex-1">

          {/* Main body — fortune level + text */}
          <div className="flex gap-0 flex-1">

            {/* Fortune level column */}
            <div
              className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-5 py-4"
              style={{ borderRight: `1px solid ${accent}22`, minWidth: '5.5rem' }}
            >
              <div
                className="font-black leading-none"
                style={{
                  fontSize: '2.8rem',
                  color: accent,
                  textShadow: `0 0 32px ${accent}60`,
                  fontFamily: '"Noto Serif SC", serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {fortune.level.label}
              </div>
              <div className="text-xs font-medium tracking-widest" style={{ color: accent, opacity: 0.55 }}>
                今日运势
              </div>
            </div>

            {/* Fortune text column */}
            <div className="flex-1 min-w-0 flex items-center px-5 py-4">
              <p
                className="leading-loose"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--md-on-surface)',
                  opacity: 0.88,
                  letterSpacing: '0.02em',
                }}
              >
                {fortune.text}
              </p>
            </div>
          </div>

          {/* Footer metadata bar */}
          <div
            className="grid grid-cols-4"
            style={{ borderTop: `1px solid ${accent}20`, background: `${accent}08` }}
          >
            {[
              { label: '幸运职业', value: fortune.job.name, sub: ROLE_LABEL[fortune.job.role], color: fortune.job.color },
              { label: '幸运属性', value: `${fortune.element.sym} ${fortune.element.name}`, color: fortune.element.color },
              { label: '今日宜',   value: fortune.activity, color: 'var(--md-on-surface-variant)' },
              { label: '幸运数字', value: String(fortune.luckyNum), color: accent, mono: true },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-0.5 py-2.5 px-2"
                style={{ borderRight: i < 3 ? `1px solid ${accent}15` : 'none' }}
              >
                <div className="text-xs" style={{ color: 'var(--md-outline)', opacity: 0.55, fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                  {item.label}
                </div>
                <div
                  className="font-semibold leading-tight text-center"
                  style={{
                    fontSize: '0.75rem',
                    color: item.color,
                    fontFamily: item.mono ? 'ui-monospace, "Cascadia Code", monospace' : undefined,
                  }}
                >
                  {item.value}
                  {item.sub && (
                    <span style={{ opacity: 0.55, fontSize: '0.6rem', marginLeft: '0.2rem' }}>
                      {item.sub}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )

  if (noWrap) return content
  return <div className="max-w-7xl mx-auto px-4 mb-6">{content}</div>
}
