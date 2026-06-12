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
      className="rounded-3xl overflow-hidden h-full"
      style={{
        background: 'var(--md-surface-container)',
        border: `1.5px solid ${accent}44`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header strip ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1.25rem 0.625rem',
        borderBottom: `1px solid ${accent}20`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ color: accent, fontSize: '0.8rem', opacity: 0.9 }}>⚔</span>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--md-on-surface-variant)', opacity: 0.65,
          }}>
            纷争前线
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ fontSize: '0.62rem', color: 'var(--md-outline)', opacity: 0.45 }}>换图</span>
          <ResetCountdown nextReset={nextReset} />
        </div>
      </div>

      {/* ── Today's map — M3 tonal hero ──────────────────────────────────── */}
      <div style={{
        padding: '1rem 1.25rem 0.875rem',
        background: `linear-gradient(145deg, ${accent}28 0%, ${accent}10 100%)`,
        position: 'relative',
        flex: '0 0 auto',
      }}>
        {/* Today label */}
        <div style={{
          fontSize: '0.6rem', fontWeight: 700,
          color: accent, opacity: 0.75,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: '0.625rem',
        }}>
          今日地图
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {/* Map icon — expressive rounded container */}
          <div style={{
            width: '3.25rem', height: '3.25rem',
            borderRadius: '1rem',
            background: `${accent}30`,
            border: `2px solid ${accent}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', flexShrink: 0,
            boxShadow: `0 4px 16px ${accent}28`,
          }}>
            {todayMap.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Map name — expressive large serif */}
            <div style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: '1.15rem', fontWeight: 900,
              color: 'var(--md-on-surface)',
              lineHeight: 1.1,
              marginBottom: '0.375rem',
            }}>
              {todayMap.name}
            </div>

            {/* Mode badge — tonal chip */}
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '0.15rem 0.625rem',
              borderRadius: '9999px',
              background: `${accent}28`,
              border: `1.5px solid ${accent}55`,
              color: accent,
              fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.04em',
            }}>
              {todayMap.mode}
            </span>
          </div>
        </div>

        {/* English subtitle */}
        <div style={{
          marginTop: '0.625rem',
          fontSize: '0.68rem', fontWeight: 500,
          color: 'var(--md-on-surface-variant)', opacity: 0.35,
          letterSpacing: '0.08em',
        }}>
          {todayMap.en}
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{ height: 1, background: `${accent}20`, margin: '0 1.25rem' }} />

      {/* ── Upcoming maps ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '0.5rem',
        padding: '0.75rem 1.25rem 1rem',
        flex: 1,
      }}>
        {nextMaps.map((m, i) => {
          const mc = adapt(m.color)
          return (
            <div key={i} style={{
              flex: 1,
              padding: '0.625rem 0.75rem',
              borderRadius: '0.875rem',
              background: 'var(--md-surface-container-high)',
              border: `1px solid ${mc}33`,
              display: 'flex', flexDirection: 'column', gap: '0.375rem',
            }}>
              {/* Day label */}
              <div style={{
                fontSize: '0.58rem', fontWeight: 700,
                color: 'var(--md-on-surface-variant)', opacity: 0.4,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {i === 0 ? '明天' : '后天'}
              </div>

              {/* Icon + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0, lineHeight: 1 }}>
                  {m.icon}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: 700,
                    color: mc, lineHeight: 1.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {m.name}
                  </div>
                  <div style={{
                    fontSize: '0.58rem',
                    color: 'var(--md-on-surface-variant)', opacity: 0.4,
                    marginTop: 2,
                  }}>
                    {m.mode}
                  </div>
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
