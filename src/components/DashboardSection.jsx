import { useState, useRef, useEffect } from 'react'
import { useCountdown } from '../hooks/useCountdown'
import { useTheme } from '../hooks/useTheme'
import { adaptForLight } from '../utils/color'
import NewsBoard from './NewsBoard'
import DailyFortune from './DailyFortune'
import FrontlineSchedule from './FrontlineSchedule'

// ── CST time helpers ──────────────────────────────────────────────────────────
const cst = (y, mo, d, h = 0, mi = 0) =>
  new Date(Date.UTC(y, mo - 1, d, h - 8, mi))

const T_GOLD_SAU_END  = cst(2026, 6, 24, 22, 59)
const T_TRIAL_CH_END  = cst(2026, 6,  7, 23, 59)
const T_TRIAL_REG_END = cst(2026, 6, 11, 13,  0)
const T_BET_CAN_BIH   = cst(2026, 6, 13,  3,  0)
const T_BET_USA_PAR   = cst(2026, 6, 13,  9,  0)
const T_BET_BRA_MAR   = cst(2026, 6, 14,  6,  0)
const T_BET_HAI_SCO   = cst(2026, 6, 14,  9,  0)
const T_BET_AUS_TUR   = cst(2026, 6, 14, 12,  0)

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const EASE   = 'cubic-bezier(0.4, 0, 0.2, 1)'

// Consistent with rounded-3xl used across all cards
const CARD_R = '1.5rem'

// ── Compact inline countdown for pill row 2 ───────────────────────────────────
function CountdownCompact({ target, expired }) {
  const t = useCountdown(target)
  if (!t) return (
    <span style={{ opacity: 0.35, fontSize: '0.7rem', fontWeight: 500 }}>{expired}</span>
  )
  const hh = String(t.h).padStart(2, '0')
  const mm = String(t.m).padStart(2, '0')
  const ss = String(t.s).padStart(2, '0')
  return (
    <span className="tabular-nums" style={{
      fontFamily: 'ui-monospace, "Cascadia Code", monospace',
      fontSize: '0.72rem', fontWeight: 700,
    }}>
      {t.d > 0 ? `${t.d}d ` : ''}{hh}:{mm}:{ss}
    </span>
  )
}

// ── Full countdown row for detail panel ───────────────────────────────────────
function CountdownRow({ label, target, expired, accentColor }) {
  const t = useCountdown(target)
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
      {label && (
        <span style={{ fontSize: '0.72rem', color: 'var(--md-on-surface-variant)', opacity: 0.6, flexShrink: 0 }}>
          {label}
        </span>
      )}
      {t ? (
        <span className="tabular-nums" style={{
          fontFamily: 'ui-monospace, "Cascadia Code", monospace',
          fontWeight: 700, fontSize: '1.15rem', color: accentColor, whiteSpace: 'nowrap',
        }}>
          {t.d > 0 && (
            <span style={{ marginRight: 3 }}>
              {t.d}<span style={{ fontSize: '0.7rem', fontWeight: 500, marginLeft: 1 }}>d</span>
            </span>
          )}
          {String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}:{String(t.s).padStart(2, '0')}
        </span>
      ) : (
        <span style={{ fontSize: '0.75rem', color: 'var(--md-on-surface-variant)', opacity: 0.5 }}>{expired}</span>
      )}
    </div>
  )
}

// ── Shared toggle button ──────────────────────────────────────────────────────
function ToggleBtn({ open, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? '收起' : '展开'}
      style={{
        flexShrink: 0,
        width: '1.5rem', height: '1.5rem',
        borderRadius: '50%',
        border: `1.5px solid ${accent}55`,
        background: open ? `${accent}2A` : `${accent}14`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: accent,
        fontSize: '1rem', fontWeight: 700, lineHeight: 1,
        transition: [`transform 0.4s ${SPRING}`, `background 0.2s ${EASE}`].join(', '),
        transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
      }}
    >
      +
    </button>
  )
}

// ── 2-row pill shell — shared by both capsule types ───────────────────────────
// Row 1: dot + title (wraps if needed) + toggle button
// Row 2: badge + primary info (countdown / match count)
function CapsulePill({ accent, badge, title, open, onToggle, children }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={onToggle}
      onKeyDown={e => e.key === 'Enter' && onToggle()}
      style={{
        padding: '0.55rem 0.625rem 0.55rem 0.875rem',
        borderRadius: CARD_R,
        background: `linear-gradient(135deg, ${accent}1A 0%, var(--md-surface-container) 60%)`,
        border: `1.5px solid ${open ? accent + 'AA' : accent + '40'}`,
        boxShadow: open ? `0 2px 12px ${accent}20` : 'none',
        cursor: 'pointer',
        outline: 'none',
        userSelect: 'none',
        maxWidth: '100%',
        overflow: 'hidden',
        transition: [`border-color 0.2s ${EASE}`, `box-shadow 0.2s ${EASE}`].join(', '),
      }}
      onMouseEnter={e => {
        if (!open) {
          e.currentTarget.style.borderColor = `${accent}77`
          e.currentTarget.style.boxShadow = `0 2px 8px ${accent}18`
        }
      }}
      onMouseLeave={e => {
        if (!open) {
          e.currentTarget.style.borderColor = `${accent}40`
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* Row 1: dot + title + toggle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: accent, flexShrink: 0, opacity: 0.85,
          marginTop: '0.35rem',
        }} />
        <span style={{
          flex: 1, minWidth: 0,
          fontFamily: '"Noto Serif SC", serif',
          fontWeight: 700, fontSize: '0.9rem',
          color: 'var(--md-on-surface)',
          lineHeight: 1.3,
          wordBreak: 'break-word', overflowWrap: 'break-word',
        }}>
          {title}
        </span>
        <ToggleBtn
          open={open} accent={accent}
          onClick={e => { e.stopPropagation(); onToggle() }}
        />
      </div>

      {/* Row 2: badge + secondary info (injected via children) */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        paddingLeft: '1.1875rem', marginTop: '0.2rem',
      }}>
        <span style={{
          fontSize: '0.6rem', fontWeight: 700,
          color: accent, opacity: 0.6,
          letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0,
        }}>
          {badge}
        </span>
        {children}
      </div>
    </div>
  )
}

// ── Activity Capsule ──────────────────────────────────────────────────────────
// open/onToggle controlled by parent — only one capsule open at a time.
// Detail panel is position:absolute so it floats without affecting sibling layout.
function ActivityCapsule({ accent: rawAccent, badge, title, subtitle, dates, rows, url, compact, open, onToggle }) {
  const bodyRef = useRef(null)
  const [bodyH, setBodyH] = useState(0)
  const { effective } = useTheme()
  const accent = effective === 'light' ? adaptForLight(rawAccent) : rawAccent

  useEffect(() => {
    if (bodyRef.current) setBodyH(bodyRef.current.scrollHeight)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const primaryRow = rows?.[0]

  return (
    <div style={{ position: 'relative', zIndex: open ? 1 : 0 }}>
      <CapsulePill accent={accent} badge={badge} title={title} open={open} onToggle={onToggle}>
        {primaryRow && (
          <span style={{ color: accent }}>
            <CountdownCompact target={primaryRow.target} expired={primaryRow.expired} />
          </span>
        )}
      </CapsulePill>

      {/* Floating detail panel — absolute so it doesn't push sibling capsules */}
      <div style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0, right: 0,
        zIndex: 10,
        maxHeight: open ? `${(bodyH || 400) + 4}px` : 0,
        overflow: 'hidden',
        pointerEvents: open ? 'auto' : 'none',
        transition: `max-height ${open ? `0.42s ${SPRING}` : `0.26s ${EASE}`}`,
      }}>
        <div
          ref={bodyRef}
          style={{
            padding: '0.875rem 1rem 1rem',
            borderRadius: CARD_R,
            background: `linear-gradient(155deg, ${accent}12 0%, var(--md-surface-container) 60%)`,
            border: `1.5px solid ${accent}44`,
            boxShadow: `0 8px 32px ${accent}22, 0 2px 8px rgba(0,0,0,0.18)`,
          }}
        >
          {subtitle && (
            <p style={{
              fontSize: '0.8rem', lineHeight: 1.6,
              color: 'var(--md-on-surface-variant)', opacity: 0.75,
              margin: '0 0 0.5rem',
            }}>
              {subtitle}
            </p>
          )}

          <div style={{ marginBottom: dates?.length ? '0.25rem' : 0 }}>
            {dates?.map((d, i) => (
              <p key={i} style={{
                fontSize: '0.75rem', lineHeight: 1.65,
                color: 'var(--md-on-surface-variant)', opacity: 0.55, margin: 0,
              }}>
                {d}
              </p>
            ))}
          </div>

          {rows?.map((r, i) => (
            <CountdownRow key={i} {...r} accentColor={accent} />
          ))}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              marginTop: '0.875rem', padding: '0.35rem 0.875rem',
              borderRadius: '9999px',
              background: `${accent}1E`, border: `1.5px solid ${accent}55`,
              color: accent, fontSize: '0.75rem', fontWeight: 600,
              textDecoration: 'none',
              transition: `background 0.18s ${EASE}, border-color 0.18s ${EASE}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${accent}36`
              e.currentTarget.style.borderColor = `${accent}99`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `${accent}1E`
              e.currentTarget.style.borderColor = `${accent}55`
            }}
          >
            前往 ↗
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Flag image ────────────────────────────────────────────────────────────────
function FlagImg({ code, name }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      width="22" height="16" alt={name} loading="lazy"
      style={{ borderRadius: 2, display: 'block', objectFit: 'cover', flexShrink: 0 }}
    />
  )
}

// ── Single match row in world cup panel ───────────────────────────────────────
// Clean vertical layout: team names → bar → stats+countdown
// No text inside the bar to avoid duplication.
function MatchRow({ homeCode, homeName, awayCode, awayName, homeWin, draw, awayWin, accent, deadline }) {
  const t = useCountdown(deadline)
  const expired = !t
  const cd = expired
    ? '已截止'
    : `${t.d > 0 ? t.d + 'd ' : ''}${String(t.h).padStart(2, '0')}:${String(t.m).padStart(2, '0')}:${String(t.s).padStart(2, '0')}`

  return (
    <div>
      {/* Team names row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: '0.375rem',
      }}>
        <FlagImg code={homeCode} name={homeName} />
        <span style={{
          flex: 1, fontSize: '0.8rem', fontWeight: 600,
          color: 'var(--md-on-surface)',
        }}>
          {homeName}
        </span>
        <span style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--md-on-surface-variant)', opacity: 0.25 }}>
          VS
        </span>
        <span style={{
          flex: 1, textAlign: 'right', fontSize: '0.8rem', fontWeight: 600,
          color: 'var(--md-on-surface)',
        }}>
          {awayName}
        </span>
        <FlagImg code={awayCode} name={awayName} />
      </div>

      {/* Probability bar — no text inside */}
      <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 10, marginBottom: '0.3rem' }}>
        <div style={{ width: `${homeWin}%`, background: accent, opacity: expired ? 0.4 : 1 }} />
        <div style={{ width: `${draw}%`, background: '#64748B', opacity: expired ? 0.4 : 1 }} />
        <div style={{ width: `${awayWin}%`, background: '#F87171', opacity: expired ? 0.4 : 1 }} />
      </div>

      {/* Stats + countdown */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: expired ? 'var(--md-on-surface-variant)' : accent, opacity: expired ? 0.4 : 1 }}>
            主胜 {homeWin}%
          </span>
          <span style={{ fontSize: '0.62rem', color: '#64748B', opacity: expired ? 0.4 : 0.8 }}>
            平 {draw}%
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#F87171', opacity: expired ? 0.4 : 1 }}>
            客胜 {awayWin}%
          </span>
        </div>
        <span style={{
          fontFamily: 'ui-monospace, monospace', fontSize: '0.62rem', fontWeight: 600,
          color: expired ? 'var(--md-on-surface-variant)' : accent,
          opacity: expired ? 0.3 : 0.85,
        }}>
          ⏱ {cd}
        </span>
      </div>
    </div>
  )
}

// ── World Cup Capsule ─────────────────────────────────────────────────────────
function WorldCupCapsule({ accent: rawAccent, badge, title, url, predictions, open, onToggle }) {
  const bodyRef = useRef(null)
  const [bodyH, setBodyH] = useState(0)
  const { effective } = useTheme()
  const accent = effective === 'light' ? adaptForLight(rawAccent) : rawAccent

  useEffect(() => {
    if (bodyRef.current) setBodyH(bodyRef.current.scrollHeight)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const soonestDeadline = predictions.reduce((best, p) =>
    (!best || p.deadline < best) ? p.deadline : best, null)

  return (
    <div style={{ position: 'relative', zIndex: open ? 1 : 0 }}>
      <CapsulePill accent={accent} badge={badge} title={title} open={open} onToggle={onToggle}>
        <span style={{ fontSize: '0.6rem', color: 'var(--md-on-surface-variant)', opacity: 0.4, flexShrink: 0 }}>
          {predictions.length} 场
        </span>
        {soonestDeadline && (
          <span style={{ color: accent }}>
            <CountdownCompact target={soonestDeadline} expired="已截止" />
          </span>
        )}
      </CapsulePill>

      {/* Floating detail panel */}
      <div style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0, right: 0,
        zIndex: 10,
        maxHeight: open ? `${(bodyH || 500) + 4}px` : 0,
        overflow: 'hidden',
        pointerEvents: open ? 'auto' : 'none',
        transition: `max-height ${open ? `0.46s ${SPRING}` : `0.28s ${EASE}`}`,
      }}>
        <div
          ref={bodyRef}
          style={{
            padding: '1rem',
            borderRadius: CARD_R,
            background: 'var(--md-surface-container)',
            border: `1.5px solid ${accent}44`,
            boxShadow: `0 8px 32px ${accent}1E, 0 2px 8px rgba(0,0,0,0.18)`,
          }}
        >
          {/* Panel header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '0.75rem',
            paddingBottom: '0.625rem',
            borderBottom: `1px solid var(--md-outline-variant)`,
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--md-on-surface-variant)', opacity: 0.5 }}>
              🤖 AI 概率预测
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: `${accent}18`, border: `1.5px solid ${accent}44`,
                color: accent, fontSize: '0.7rem', fontWeight: 600,
                textDecoration: 'none',
                transition: `background 0.15s ${EASE}`,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = `${accent}30`)}
              onMouseLeave={e => (e.currentTarget.style.background = `${accent}18`)}
            >
              前往竞猜 ↗
            </a>
          </div>

          {/* Match list — add/remove MatchRow entries freely */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {predictions.map((p, i) => (
              <div key={i}>
                {i > 0 && (
                  <div style={{ height: 1, background: 'var(--md-outline-variant)', opacity: 0.4, marginBottom: '0.75rem' }} />
                )}
                <MatchRow {...p} accent={accent} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Patch notes ───────────────────────────────────────────────────────────────
const PATCH_751_NOTES = [
  {
    category: '绝境战', color: '#F87171',
    items: ['追加「妖星乱舞绝境战」', '完成零式登天斗技场重量级4后开放', '8人组队，限时120分钟', '通关可换取绝境战专属武器'],
  },
  {
    category: '宇宙探索', color: '#4DD0E1',
    items: ['追加全新星球「奥克塞西亚行星」', '追加熟练度探索任务（需宇宙工具满级）', '宇宙工具可进一步强化', '追加奥克塞西亚信用点与探索计划票据'],
  },
  {
    category: '老主顾交易', color: '#F4C161',
    items: ['追加老主顾「缇索加」', '可获得金币、经验值、巧手/大地票据', '每周共可进行12次交易', '完成主线「明日的路标」后开放'],
  },
  {
    category: '道具 / 系统', color: '#A78BFA',
    items: ['染色系统：7种色素整合为统一「色素」', '追加新坐骑、宠物、时尚配饰', '追加新情感动作与九宫幻卡', '肖像追加新装饰与可设置动作'],
  },
  {
    category: '房屋 / 其他', color: '#81C784',
    items: ['家具超400件时临时停用隐藏机制', '新增支线任务（宇宙探索相关）', '追加全新制作配方与采集道具', '修复多项职业技能与副本问题'],
  },
]

// ── Version banner ────────────────────────────────────────────────────────────
function VersionBanner({ onToggle }) {
  const [open, setOpen] = useState(false)

  const toggle = () => {
    const next = !open
    setOpen(next)
    onToggle?.(next)
  }

  return (
    <div className="relative">
      <div className="relative rounded-3xl" style={{
        background: 'var(--md-primary-container)',
        border: '1.5px solid var(--md-primary)',
        color: 'var(--md-on-primary-container)',
      }}>
        <div
          className="flex items-center gap-4 px-5 py-4 cursor-pointer rounded-3xl"
          style={{ minHeight: '4rem', transition: `filter 0.18s ${EASE}` }}
          onClick={toggle}
          onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.filter = '')}
        >
          <div
            className="flex-shrink-0 rounded-2xl px-3 py-1.5"
            style={{ background: 'var(--md-primary)', color: 'var(--md-on-primary)' }}
          >
            <span style={{ fontFamily: '"Noto Serif SC", serif', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '-0.02em' }}>
              7.51
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium mb-0.5" style={{ opacity: 0.5, letterSpacing: '0.08em' }}>
              CURRENT PATCH
            </div>
            <div className="font-bold" style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
              天际的行路
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <a
              href="https://ff.web.sdo.com/web8/index.html#/newstab/newscont/387965"
              target="_blank" rel="noopener noreferrer"
              className="text-xs opacity-45 hover:opacity-80"
              style={{ transition: 'opacity 0.15s', whiteSpace: 'nowrap' }}
              onClick={e => e.stopPropagation()}
            >
              更新说明 ↗
            </a>
            <span style={{
              display: 'inline-block', opacity: 0.5, fontSize: '1.1rem',
              transition: `transform 0.28s ${SPRING}`,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>
              ▾
            </span>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 100,
        borderRadius: CARD_R,
        background: 'var(--md-surface-container-highest)',
        border: '1.5px solid var(--md-primary)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.50)',
        overflow: 'hidden',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.97)',
        pointerEvents: open ? 'auto' : 'none',
        transition: `opacity 0.24s ${EASE}, transform 0.28s ${SPRING}`,
      }}>
        <div
          className="px-5 pt-4 pb-4 grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))' }}
        >
          {PATCH_751_NOTES.map(section => (
            <div key={section.category}>
              <div
                className="text-xs font-semibold mb-1.5 px-2 py-0.5 rounded-full inline-block"
                style={{ background: `${section.color}28`, color: section.color, letterSpacing: '0.04em' }}
              >
                {section.category}
              </div>
              <ul className="space-y-1">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-xs leading-snug"
                    style={{ color: 'var(--md-on-surface)', opacity: 0.8, paddingLeft: '0.75rem', position: 'relative' }}
                  >
                    <span style={{ position: 'absolute', left: 0, opacity: 0.4 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="px-5 pb-3 text-right" style={{ borderTop: '1px solid var(--md-outline-variant)' }}>
          <a
            href="https://ff.web.sdo.com/web8/index.html#/newstab/newscont/387965"
            target="_blank" rel="noopener noreferrer"
            className="text-xs"
            style={{ color: 'var(--md-primary)', opacity: 0.8 }}
          >
            查看完整更新说明 →
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function DashboardSection() {
  // Single openId ensures only one capsule is open at a time
  const [openId,     setOpenId]     = useState(null)
  const [bannerOpen, setBannerOpen] = useState(false)

  const toggle = (id) => setOpenId(v => v === id ? null : id)

  return (
    <div className="max-w-7xl mx-auto px-4 mb-6">
      <div className="bento-grid">

        {/* ① Activity capsule row — full width, floating panels, one open at a time */}
        {/* z-index elevated when any capsule is open so panels float above cells below */}
        <div className="bento-cell bento-acts" style={{ zIndex: openId ? 50 : 0 }}>
          <div className="acts-grid">
            <ActivityCapsule
              accent="#4DD0E1"
              badge="下个版本"
              title="7.55"
              subtitle="预计上线时间未定"
              dates={[
                '大型战斗任务「蜃景幻境新月岛北征之章」',
                '武器强化任务「幻境武器」',
                '非著名调查员 金曦之章',
                '友好部族盟友任务 金曦之章',
              ]}
              rows={[]}
              compact
              url="https://actff1.web.sdo.com/project/20240927dawntrail/patch75/index.html"
              open={openId === 'next-patch'}
              onToggle={() => toggle('next-patch')}
            />
            <ActivityCapsule
              accent="#F4C161"
              badge="季节活动"
              title="金碟嘉年华 2026"
              dates={['5月29日 16:00 – 6月24日 22:59']}
              rows={[{ label: '距结束', target: T_GOLD_SAU_END, expired: '已结束' }]}
              url="https://actff1.web.sdo.com/project/20260519the_make_it_rain_campaign/86z02yp9k67o/index.html"
              open={openId === 'gold-sau'}
              onToggle={() => toggle('gold-sau')}
            />
            <ActivityCapsule
              accent="#FFAB76"
              badge="运营活动"
              title="黄金的试炼 第66期"
              subtitle="修行古刹星导寺"
              rows={[
                { label: '挑战期', target: T_TRIAL_CH_END,  expired: '已截止' },
                { label: '登记期', target: T_TRIAL_REG_END, expired: '已截止' },
              ]}
              url="https://actff1.web.sdo.com/20241130_GoldTrial/#/index"
              open={openId === 'gold-trial'}
              onToggle={() => toggle('gold-trial')}
            />
            <WorldCupCapsule
              accent="#4CAF50"
              badge="运营活动"
              title="世界杯竞猜"
              url="https://actff1.web.sdo.com/20240520_NewJingCai/index.html#/index"
              predictions={[
                { homeCode: 'ca', homeName: '加拿大',   awayCode: 'ba',     awayName: '波黑',   homeWin: 45, draw: 28, awayWin: 27, deadline: T_BET_CAN_BIH },
                { homeCode: 'us', homeName: '美国',     awayCode: 'py',     awayName: '巴拉圭', homeWin: 55, draw: 25, awayWin: 20, deadline: T_BET_USA_PAR },
                { homeCode: 'br', homeName: '巴西',     awayCode: 'ma',     awayName: '摩洛哥', homeWin: 50, draw: 30, awayWin: 20, deadline: T_BET_BRA_MAR },
                { homeCode: 'ht', homeName: '海地',     awayCode: 'gb-sct', awayName: '苏格兰', homeWin: 15, draw: 25, awayWin: 60, deadline: T_BET_HAI_SCO },
                { homeCode: 'au', homeName: '澳大利亚', awayCode: 'tr',     awayName: '土耳其', homeWin: 30, draw: 30, awayWin: 40, deadline: T_BET_AUS_TUR },
              ]}
              open={openId === 'world-cup'}
              onToggle={() => toggle('world-cup')}
            />
          </div>
        </div>

        {/* ② Version banner — z-index raised when dropdown is open */}
        <div className="bento-cell bento-banner" style={{ zIndex: bannerOpen ? 50 : 0 }}>
          <VersionBanner onToggle={setBannerOpen} />
        </div>

        {/* ③ Fortune + Frontline */}
        <div className="bento-cell bento-bottom">
          <div className="bottom-grid">
            <DailyFortune noWrap />
            <FrontlineSchedule noWrap />
          </div>
        </div>

        {/* ④ News sidebar */}
        <div className="bento-cell bento-news flex flex-col">
          <NewsBoard noWrap />
        </div>

      </div>
    </div>
  )
}
