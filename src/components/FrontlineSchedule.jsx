import { useMemo } from 'react'
import { useCountdown, fmtCountdown } from '../hooks/useCountdown'

// ── Schedule algorithm ────────────────────────────────────────────────────────
// Source: https://github.com/sijiamaoche/ff14-daily-frontline-widget
// Rotation: 8-day cycle, resets at 23:00 CST (UTC+8) = 15:00 UTC

const KNOWN_DATE = '2026-05-08'
const KNOWN_MAP  = 7          // 1-indexed: map slot on KNOWN_DATE
const RESET_HOUR_UTC = 15     // 23:00 Beijing = 15:00 UTC

// Return the most recent reset timestamp (Date) for a given moment
function getResetTime(date) {
  const d = new Date(date)
  d.setUTCHours(RESET_HOUR_UTC, 0, 0, 0)
  if (date < d) d.setUTCDate(d.getUTCDate() - 1)
  return d
}

function getMapIndex(now) {
  const knownReset = getResetTime(new Date(KNOWN_DATE + 'T12:00:00+08:00'))
  const todayReset = getResetTime(now)
  const daysDiff   = Math.round((todayReset - knownReset) / 86400000)
  return (((KNOWN_MAP - 1 + daysDiff) % 8) + 8) % 8
}

// Next reset timestamp
function getNextReset(now) {
  const d = new Date(now)
  d.setUTCHours(RESET_HOUR_UTC, 0, 0, 0)
  if (now >= d) d.setUTCDate(d.getUTCDate() + 1)
  return d
}

// ── Data ──────────────────────────────────────────────────────────────────────

const MAPS = [
  { name: '尘封秘岩', en: 'Borderland Ruins', mode: '争夺战', color: '#9575CD', icon: '🏰' },
  { name: '荣誉野',   en: 'Fields of Glory',  mode: '碎冰战', color: '#4FC3F7', icon: '❄️'  },
  { name: '昂萨哈凯尔', en: 'Onsal Hakair',    mode: '竞争战', color: '#66BB6A', icon: '🏴' },
  { name: '沃刻其特', en: 'Worqor Chirteh',   mode: '演习战', color: '#FFA726', icon: '🐉' },
  { name: '尘封秘岩', en: 'Borderland Ruins', mode: '争夺战', color: '#9575CD', icon: '🏰' },
  { name: '周边遗迹群', en: 'Seal Rock',       mode: '阵地战', color: '#26C6DA', icon: '🪨' },
  { name: '昂萨哈凯尔', en: 'Onsal Hakair',    mode: '竞争战', color: '#66BB6A', icon: '🏴' },
  { name: '沃刻其特', en: 'Worqor Chirteh',   mode: '演习战', color: '#FFA726', icon: '🐉' },
]

const DAY_LABELS = ['今日', '明日', '后日']

// ── Component ─────────────────────────────────────────────────────────────────

function ResetCountdown({ nextReset }) {
  const t = useCountdown(nextReset)
  const str = fmtCountdown(t)
  if (!str) return <span style={{ color: 'var(--md-outline)', opacity: 0.5, fontSize: '0.7rem' }}>已重置</span>
  return (
    <span
      className="tabular-nums"
      style={{
        fontFamily: 'ui-monospace, "Cascadia Code", monospace',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: 'var(--md-on-surface-variant)',
        opacity: 0.75,
      }}
    >
      {str}
    </span>
  )
}

export default function FrontlineSchedule({ noWrap = false }) {
  const { todayMap, nextMaps, nextReset } = useMemo(() => {
    const now  = new Date()
    const base = getMapIndex(now)
    return {
      todayMap:  MAPS[base],
      nextMaps:  [MAPS[(base + 1) % 8], MAPS[(base + 2) % 8]],
      nextReset: getNextReset(now),
    }
  }, [])

  const accent = todayMap.color

  const content = (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(145deg, var(--glass-bg) 40%, ${accent}16 100%)`,
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: `1px solid ${accent}30`,
        borderTopColor: `${accent}55`,
        boxShadow: `var(--glass-shadow), 0 0 40px ${accent}10, var(--glass-inset)`,
        position: 'relative',
      }}
    >
      {/* Accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 55% at 100% 5%, ${accent}20 0%, transparent 60%)`,
        }}
      />

      {/* Header */}
      <div
        className="relative flex items-center justify-between px-5 py-2.5"
        style={{ borderBottom: `1px solid ${accent}20` }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--md-primary)', opacity: 0.7, fontSize: '0.75rem' }}>⚔</span>
          <span className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--md-on-surface-variant)', letterSpacing: '0.15em' }}>
            纷争前线
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: 'var(--md-outline)', opacity: 0.5 }}>换图</span>
          <ResetCountdown nextReset={nextReset} />
        </div>
      </div>

      {/* Today's map */}
      <div className="relative px-5 py-4">
        <div className="flex items-center gap-4">
          {/* Icon + mode */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5"
            style={{
              background: `${accent}22`,
              border: `1px solid ${accent}50`,
              borderTopColor: `${accent}80`,
              boxShadow: `0 4px 16px ${accent}30, inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}
          >
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{todayMap.icon}</span>
            <span className="text-xs font-medium" style={{ color: accent, fontSize: '0.6rem', letterSpacing: '0.05em' }}>
              {todayMap.mode}
            </span>
          </div>

          {/* Map info */}
          <div className="flex-1 min-w-0">
            <div className="text-xs mb-0.5" style={{ color: accent, opacity: 0.75, fontWeight: 600 }}>
              今日地图
            </div>
            <div
              className="font-bold leading-tight mb-0.5"
              style={{
                fontSize: '1.1rem',
                color: accent,
                textShadow: `0 0 18px ${accent}44`,
                fontFamily: '"Noto Serif SC", serif',
              }}
            >
              {todayMap.name}
            </div>
            <div className="text-xs" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.55 }}>
              {todayMap.en}
            </div>
          </div>
        </div>

        {/* Upcoming maps */}
        <div className="mt-3 flex gap-2">
          {nextMaps.map((m, i) => (
            <div
              key={i}
              className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTopColor: 'rgba(255,255,255,0.12)',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{m.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-medium truncate" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.6 }}>
                  {DAY_LABELS[i + 1]}
                </div>
                <div className="text-xs font-semibold truncate" style={{ color: m.color }}>
                  {m.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (noWrap) return content
  return <div className="max-w-7xl mx-auto px-4 mb-6">{content}</div>
}
