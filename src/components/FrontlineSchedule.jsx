import { useMemo } from 'react'
import { useCountdown, fmtCountdown } from '../hooks/useCountdown'
import { useTheme } from '../hooks/useTheme'
import { adaptForLight } from '../utils/color'

// ── Schedule algorithm ────────────────────────────────────────────────────────
// Source: https://github.com/sijiamaoche/ff14-daily-frontline-widget
// Rotation: 8-day cycle, resets at 23:00 CST (UTC+8) = 15:00 UTC

const KNOWN_DATE   = '2026-05-08'
const KNOWN_MAP    = 7
const RESET_HOUR_UTC = 15

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

function getNextReset(now) {
  const d = new Date(now)
  d.setUTCHours(RESET_HOUR_UTC, 0, 0, 0)
  if (now >= d) d.setUTCDate(d.getUTCDate() + 1)
  return d
}

// ── Map data ─────────────────────────────────────────────────────────────────
const MAPS = [
  { name: '尘封秘岩',   en: 'Borderland Ruins', mode: '争夺战', color: '#9575CD', icon: '🏰' },
  { name: '荣誉野',     en: 'Fields of Glory',  mode: '碎冰战', color: '#4FC3F7', icon: '❄️'  },
  { name: '昂萨哈凯尔', en: 'Onsal Hakair',     mode: '竞争战', color: '#66BB6A', icon: '🏴' },
  { name: '沃刻其特',   en: 'Worqor Chirteh',   mode: '演习战', color: '#FFA726', icon: '🐉' },
  { name: '尘封秘岩',   en: 'Borderland Ruins', mode: '争夺战', color: '#9575CD', icon: '🏰' },
  { name: '周边遗迹群', en: 'Seal Rock',         mode: '阵地战', color: '#26C6DA', icon: '🪨' },
  { name: '昂萨哈凯尔', en: 'Onsal Hakair',     mode: '竞争战', color: '#66BB6A', icon: '🏴' },
  { name: '沃刻其特',   en: 'Worqor Chirteh',   mode: '演习战', color: '#FFA726', icon: '🐉' },
]

// ── Reset countdown ───────────────────────────────────────────────────────────
function ResetCountdown({ nextReset }) {
  const t = useCountdown(nextReset)
  const str = fmtCountdown(t)
  if (!str) return (
    <span style={{ fontSize: '0.68rem', color: 'var(--md-outline)', opacity: 0.5 }}>
      已重置
    </span>
  )
  return (
    <span className="tabular-nums" style={{
      fontFamily: 'ui-monospace, "Cascadia Code", monospace',
      fontSize: '0.72rem', fontWeight: 700,
      color: 'var(--md-on-surface-variant)', opacity: 0.7,
    }}>
      {str}
    </span>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FrontlineSchedule({ noWrap = false }) {
  const { effective } = useTheme()
  const adapt = c => effective === 'light' ? adaptForLight(c) : c

  const { todayMap, nextMaps, nextReset } = useMemo(() => {
    const now  = new Date()
    const base = getMapIndex(now)
    return {
      todayMap:  MAPS[base],
      nextMaps:  [MAPS[(base + 1) % 8], MAPS[(base + 2) % 8]],
      nextReset: getNextReset(now),
    }
  }, [])

  const accent = adapt(todayMap.color)

  const content = (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        height: '196px',
        background: `radial-gradient(ellipse 140% 110% at -8% 65%, ${accent}20 0%, var(--md-surface-container) 52%)`,
        border: `1.5px solid ${accent}30`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.625rem 1.25rem 0.5rem',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ color: accent, fontSize: '0.72rem', opacity: 0.9 }}>⚔</span>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--md-on-surface-variant)', opacity: 0.65,
          }}>纷争前线</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--md-outline)', opacity: 0.45 }}>换图</span>
          <ResetCountdown nextReset={nextReset} />
        </div>
      </div>

      {/* ── Today's map — primary, typography-driven hierarchy ───────────── */}
      <div style={{ padding: '0.125rem 1.25rem 0.5rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
          <span style={{
            fontSize: '1.5rem', lineHeight: 1, flexShrink: 0,
            filter: `drop-shadow(0 0 7px ${accent}99)`,
          }}>
            {todayMap.icon}
          </span>
          <span style={{
            fontFamily: '"Noto Serif SC", serif',
            fontSize: '1.2rem', fontWeight: 900,
            color: 'var(--md-on-surface)',
            lineHeight: 1.1,
          }}>
            {todayMap.name}
          </span>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '0.1rem 0.5rem',
          borderRadius: '9999px',
          background: `${accent}18`,
          border: `1px solid ${accent}40`,
          color: accent,
          fontSize: '0.63rem', fontWeight: 700,
          letterSpacing: '0.04em',
        }}>
          {todayMap.mode}
        </span>
      </div>

      {/* ── Upcoming — secondary, inline layout, no card containers ─────── */}
      <div style={{
        display: 'flex',
        padding: '0.375rem 1.25rem 0.625rem',
        flex: 1, minHeight: 0,
        borderTop: `1px solid ${accent}12`,
      }}>
        {nextMaps.map((m, i) => {
          const mc = adapt(m.color)
          return (
            <div key={i} style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: '0.375rem',
              paddingRight: i === 0 ? '0.875rem' : 0,
              paddingLeft: i === 1 ? '0.875rem' : 0,
              borderRight: i === 0 ? `1px solid ${accent}12` : 'none',
            }}>
              <span style={{ fontSize: '0.9rem', opacity: 0.5, flexShrink: 0 }}>
                {m.icon}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '0.6rem', color: 'var(--md-on-surface-variant)',
                  opacity: 0.38, marginBottom: '0.1rem',
                }}>
                  {i === 0 ? '明天' : '后天'}
                </div>
                <div style={{
                  fontSize: '0.72rem', fontWeight: 600, color: mc, opacity: 0.75,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {m.name}
                </div>
                <div style={{
                  fontSize: '0.57rem', color: 'var(--md-on-surface-variant)',
                  opacity: 0.32, marginTop: '0.1rem',
                }}>
                  {m.mode}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  if (noWrap) return content
  return <div className="max-w-7xl mx-auto px-4 mb-6">{content}</div>
}
