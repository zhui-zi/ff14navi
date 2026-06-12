import { useState, useRef, useEffect } from 'react'
import { useCountdown } from '../hooks/useCountdown'
import { useTheme } from '../hooks/useTheme'
import { adaptForLight } from '../utils/color'
import NewsBoard from './NewsBoard'
import DailyFortune from './DailyFortune'
import FrontlineSchedule from './FrontlineSchedule'

// ── CST time helpers ─────────────────────────────────────────────────────────
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

// Spring easing shared across all container morphs
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const EASE   = 'cubic-bezier(0.4, 0, 0.2, 1)'

// ── Countdown ────────────────────────────────────────────────────────────────
function Countdown({ target, expired, accentColor }) {
  const t = useCountdown(target)
  if (!t) return (
    <span style={{ fontSize: '0.75rem', color: 'var(--md-on-surface-variant)', opacity: 0.5 }}>{expired}</span>
  )
  const hh = String(t.h).padStart(2, '0')
  const mm = String(t.m).padStart(2, '0')
  const ss = String(t.s).padStart(2, '0')
  return (
    <span className="tabular-nums" style={{
      fontFamily: 'ui-monospace, "Cascadia Code", monospace',
      fontWeight: 700, fontSize: '1.15rem', color: accentColor, whiteSpace: 'nowrap',
    }}>
      {t.d > 0 && <span style={{ marginRight: 3 }}>{t.d}<span style={{ fontSize: '0.7rem', fontWeight: 500, marginLeft: 1 }}>d</span></span>}
      {hh}:{mm}:{ss}
    </span>
  )
}

function CountdownRow({ label, target, expired, accentColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
      {label && <span style={{ fontSize: '0.72rem', color: 'var(--md-on-surface-variant)', opacity: 0.6, flexShrink: 0 }}>{label}</span>}
      <Countdown target={target} expired={expired} accentColor={accentColor} />
    </div>
  )
}

// ── Activity Card — Progressive Disclosure + Container Morph ─────────────────
//
// Collapsed: pill (border-radius: 9999px), shows accent dot + badge + title + "+"
// Expanded:  M3 Expressive asymmetric card (28px 28px 28px 8px), body slides in
//
// The pill→card morph uses a spring transition on border-radius.
// Body height is measured once on mount so max-height transitions precisely.
function ActivityCard({ accent: rawAccent, badge, title, subtitle, dates, rows, url, compact }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef(null)
  const [bodyH, setBodyH] = useState(0)
  const { effective } = useTheme()
  const accent = effective === 'light' ? adaptForLight(rawAccent) : rawAccent

  // Measure the natural height of the body content once, before it's clipped
  useEffect(() => {
    if (bodyRef.current) setBodyH(bodyRef.current.scrollHeight)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const PILL_R   = '9999px'
  // Bottom-right corner is deliberately small — creates an "origami fold" feel
  const CARD_R   = '28px 28px 28px 8px'

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={() => !open && setOpen(true)}
      onKeyDown={e => e.key === 'Enter' && !open && setOpen(true)}
      style={{
        background: `linear-gradient(155deg, ${accent}1E 0%, var(--md-surface-container) 50%)`,
        border: `1.5px solid ${open ? accent + 'BB' : accent + '44'}`,
        borderRadius: open ? CARD_R : PILL_R,
        boxShadow: open
          ? `0 8px 32px ${accent}2E, 0 2px 8px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.06)`
          : 'none',
        overflow: 'hidden',
        cursor: open ? 'default' : 'pointer',
        outline: 'none',
        transition: [
          `border-radius 0.46s ${SPRING}`,
          `border-color 0.22s ${EASE}`,
          `box-shadow 0.3s ${EASE}`,
        ].join(', '),
      }}
      onMouseEnter={e => {
        if (!open) {
          e.currentTarget.style.borderColor = `${accent}88`
          e.currentTarget.style.boxShadow = `0 4px 16px ${accent}22`
        }
      }}
      onMouseLeave={e => {
        if (!open) {
          e.currentTarget.style.borderColor = `${accent}44`
          e.currentTarget.style.boxShadow = ''
        }
      }}
    >
      {/* ── Pill header — always visible ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: open ? '0.875rem 1rem 0.5rem' : '0.625rem 0.875rem',
        transition: `padding 0.32s ${EASE}`,
        minHeight: 48,
      }}>

        {/* Accent dot — pulses slightly when expanded */}
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: accent, flexShrink: 0, opacity: 0.9,
          transform: open ? 'scale(1.4)' : 'scale(1)',
          transition: `transform 0.36s ${SPRING}`,
        }} />

        {/* Badge */}
        <span style={{
          fontSize: '0.65rem', fontWeight: 700,
          color: accent, opacity: 0.7,
          letterSpacing: '0.06em', flexShrink: 0,
          textTransform: 'uppercase',
        }}>
          {badge}
        </span>

        {/* Title */}
        <span style={{
          flex: 1, minWidth: 0,
          fontFamily: '"Noto Serif SC", serif',
          fontWeight: 700,
          fontSize: open ? '1rem' : '0.875rem',
          color: 'var(--md-on-surface)',
          whiteSpace: open ? 'normal' : 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: `font-size 0.28s ${EASE}`,
        }}>
          {title}
        </span>

        {/* Toggle button: + rotates to × */}
        <button
          onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
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
            transition: [
              `transform 0.4s ${SPRING}`,
              `background 0.2s ${EASE}`,
            ].join(', '),
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </button>
      </div>

      {/* ── Expandable body — slides in/out with measured max-height ── */}
      <div style={{
        maxHeight: open ? `${bodyH || 400}px` : 0,
        overflow: 'hidden',
        // Expand slightly slower (spring), collapse faster (ease-in)
        transition: `max-height ${open ? `0.46s ${SPRING}` : `0.28s ${EASE}`}`,
      }}>
        <div ref={bodyRef} style={{ padding: '0 1rem 1rem' }}>

          {subtitle && (
            <p style={{
              fontSize: '0.8rem', lineHeight: 1.6,
              color: 'var(--md-on-surface-variant)', opacity: 0.75,
              marginBottom: '0.5rem', margin: '0 0 0.5rem',
            }}>
              {subtitle}
            </p>
          )}

          {compact ? (
            <div style={{ marginBottom: '0.25rem' }}>
              {dates?.map((d, i) => (
                <p key={i} style={{ fontSize: '0.75rem', lineHeight: 1.65, color: 'var(--md-on-surface-variant)', opacity: 0.55, margin: 0 }}>{d}</p>
              ))}
            </div>
          ) : (
            <div style={{ marginBottom: dates?.length ? '0.125rem' : 0 }}>
              {dates?.map((d, i) => (
                <p key={i} style={{ fontSize: '0.75rem', lineHeight: 1.65, color: 'var(--md-on-surface-variant)', opacity: 0.55, margin: 0 }}>{d}</p>
              ))}
            </div>
          )}

          {rows?.map((r, i) => (
            <CountdownRow key={i} {...r} accentColor={accent} />
          ))}

          {/* Navigation chip — only meaningful after expansion */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              marginTop: '0.875rem',
              padding: '0.35rem 0.875rem',
              borderRadius: '9999px',
              background: `${accent}1E`,
              border: `1.5px solid ${accent}55`,
              color: accent,
              fontSize: '0.75rem', fontWeight: 600,
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

// ── World Cup: match column ───────────────────────────────────────────────────
function MatchColumn({ homeFlag, homeName, awayFlag, awayName, homeWin, draw, awayWin, accent, deadline }) {
  const t = useCountdown(deadline)
  const cd = t
    ? `${t.d > 0 ? t.d + 'd ' : ''}${String(t.h).padStart(2, '0')}:${String(t.m).padStart(2, '0')}:${String(t.s).padStart(2, '0')}`
    : '已截止'
  const segments = [
    { pct: homeWin, color: accent },
    { pct: draw,    color: '#64748B' },
    { pct: awayWin, color: '#F87171' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.625rem 0.5rem', background: 'var(--md-surface-container)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
        <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{homeFlag}</span>
        <span style={{ fontSize: '0.45rem', fontWeight: 700, color: 'var(--md-on-surface-variant)', opacity: 0.3 }}>VS</span>
        <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{awayFlag}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, marginBottom: 8 }}>
        <span style={{ flex: 1, textAlign: 'right', fontSize: '0.6rem', fontWeight: 500, color: 'var(--md-on-surface)', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{homeName}</span>
        <span style={{ opacity: 0.2, fontSize: '0.45rem', flexShrink: 0 }}>·</span>
        <span style={{ flex: 1, fontSize: '0.6rem', fontWeight: 500, color: 'var(--md-on-surface)', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{awayName}</span>
      </div>
      <div style={{ width: '100%', display: 'flex', borderRadius: 9999, overflow: 'hidden', height: 11, marginBottom: 4 }}>
        {segments.map((s, i) => (
          <div key={i} style={{
            width: `${s.pct}%`, backgroundColor: s.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: `width 0.5s ${SPRING}`,
          }}>
            {s.pct >= 27 && <span style={{ fontSize: '0.45rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{s.pct}%</span>}
          </div>
        ))}
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        {segments.map((s, i) => (
          <span key={i} style={{ fontSize: '0.55rem', fontWeight: 600, color: s.color }}>{s.pct}%</span>
        ))}
      </div>
      <span style={{
        fontSize: '0.55rem', fontFamily: 'ui-monospace, monospace', fontWeight: 600,
        color: t ? accent : 'var(--md-on-surface-variant)', opacity: t ? 0.8 : 0.35,
      }}>⏱ {cd}</span>
    </div>
  )
}

// ── Predictions strip — Progressive Disclosure ────────────────────────────────
// Collapsed: single pill row (badge + title + match count + link)
// Expanded:  container morphs to card, match grid slides in
// Uses fold-at-top-right asymmetric radius for visual variety
function PredictionsStrip({ accent: rawAccent, badge, title, url, predictions }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef(null)
  const [bodyH, setBodyH] = useState(0)
  const { effective } = useTheme()
  const accent = effective === 'light' ? adaptForLight(rawAccent) : rawAccent

  useEffect(() => {
    if (bodyRef.current) setBodyH(bodyRef.current.scrollHeight)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Asymmetric: fold at top-right — complements the ActivityCard folds
  const CARD_R = '28px 8px 28px 28px'

  return (
    <div
      style={{
        border: `1.5px solid ${open ? accent + 'BB' : accent + '44'}`,
        borderRadius: open ? CARD_R : '9999px',
        overflow: 'hidden',
        boxShadow: open ? `0 8px 32px ${accent}2E, 0 2px 8px ${accent}14` : 'none',
        transition: [
          `border-radius 0.46s ${SPRING}`,
          `border-color 0.22s ${EASE}`,
          `box-shadow 0.3s ${EASE}`,
        ].join(', '),
      }}
    >
      {/* Header — always visible as pill */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: open ? '0.875rem 1rem 0.5rem' : '0.625rem 0.875rem',
          background: `linear-gradient(90deg, ${accent}1E 0%, var(--md-surface-container) 55%)`,
          cursor: 'pointer',
          transition: `padding 0.32s ${EASE}`,
          minHeight: 48,
        }}
      >
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: accent,
          flexShrink: 0, opacity: 0.9,
          transform: open ? 'scale(1.4)' : 'scale(1)',
          transition: `transform 0.36s ${SPRING}`,
        }} />

        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: accent, opacity: 0.7, letterSpacing: '0.06em', flexShrink: 0, textTransform: 'uppercase' }}>
          {badge}
        </span>

        <span style={{
          fontFamily: '"Noto Serif SC", serif', fontWeight: 700,
          fontSize: open ? '1rem' : '0.875rem',
          color: 'var(--md-on-surface)', flexShrink: 0,
          transition: `font-size 0.28s ${EASE}`,
        }}>
          {title}
        </span>

        {!open && (
          <span style={{ fontSize: '0.65rem', color: 'var(--md-on-surface-variant)', opacity: 0.4 }}>
            {predictions.length} 场 · 🤖 AI
          </span>
        )}

        <span style={{ flex: 1 }} />

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ fontSize: '0.72rem', color: accent, opacity: 0.65, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          前往竞猜 →
        </a>

        <button
          onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
          aria-label={open ? '收起' : '展开'}
          style={{
            flexShrink: 0, width: '1.5rem', height: '1.5rem',
            borderRadius: '50%',
            border: `1.5px solid ${accent}55`,
            background: open ? `${accent}2A` : `${accent}14`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: accent,
            fontSize: '1rem', fontWeight: 700, lineHeight: 1,
            transition: [
              `transform 0.4s ${SPRING}`,
              `background 0.2s ${EASE}`,
            ].join(', '),
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </button>
      </div>

      {/* Match grid — slides in on expand */}
      <div style={{
        maxHeight: open ? `${bodyH || 300}px` : 0,
        overflow: 'hidden',
        transition: `max-height ${open ? `0.46s ${SPRING}` : `0.28s ${EASE}`}`,
      }}>
        <div ref={bodyRef}>
          <div style={{ padding: '0.25rem 1rem 0', fontSize: '0.68rem', color: 'var(--md-on-surface-variant)', opacity: 0.4 }}>
            🤖 AI 概率预测
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(106px, 1fr))',
            gap: '1px',
            background: `${accent}1E`,
            marginTop: '0.375rem',
          }}>
            {predictions.map((p, i) => (
              <MatchColumn key={i} {...p} accent={accent} />
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

// ── Version banner (fixed size, no PD needed) ─────────────────────────────────
function VersionBanner() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" style={{ zIndex: open ? 50 : 'auto' }}>
      <div className="relative rounded-3xl" style={{
        background: 'var(--md-primary-container)',
        border: '1.5px solid var(--md-primary)',
        color: 'var(--md-on-primary-container)',
      }}>
        <div
          className="flex items-center gap-4 px-5 py-4 cursor-pointer rounded-3xl"
          style={{ minHeight: '4rem', transition: `filter 0.18s ${EASE}` }}
          onClick={() => setOpen(v => !v)}
          onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.filter = '')}
        >
          <div className="flex-shrink-0 rounded-2xl px-3 py-1.5"
            style={{ background: 'var(--md-primary)', color: 'var(--md-on-primary)' }}>
            <span style={{ fontFamily: '"Noto Serif SC", serif', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '-0.02em' }}>
              7.51
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium mb-0.5" style={{ opacity: 0.5, letterSpacing: '0.08em' }}>CURRENT PATCH</div>
            <div className="font-bold" style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
              天际的行路
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <a href="https://ff.web.sdo.com/web8/index.html#/newstab/newscont/387965"
              target="_blank" rel="noopener noreferrer"
              className="text-xs opacity-45 hover:opacity-80"
              style={{ transition: `opacity 0.15s`, whiteSpace: 'nowrap' }}
              onClick={e => e.stopPropagation()}>
              更新说明 ↗
            </a>
            <span style={{
              display: 'inline-block', opacity: 0.5, fontSize: '1.1rem',
              transition: `transform 0.28s ${SPRING}`,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>▾</span>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 100,
        borderRadius: '1.25rem',
        background: 'var(--md-surface-container-highest)',
        border: '1.5px solid var(--md-primary)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.50)',
        overflow: 'hidden',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.97)',
        pointerEvents: open ? 'auto' : 'none',
        transition: `opacity 0.24s ${EASE}, transform 0.28s ${SPRING}`,
      }}>
        <div className="px-5 pt-4 pb-4 grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))' }}>
          {PATCH_751_NOTES.map(section => (
            <div key={section.category}>
              <div className="text-xs font-semibold mb-1.5 px-2 py-0.5 rounded-full inline-block"
                style={{ background: `${section.color}28`, color: section.color, letterSpacing: '0.04em' }}>
                {section.category}
              </div>
              <ul className="space-y-1">
                {section.items.map((item, i) => (
                  <li key={i} className="text-xs leading-snug"
                    style={{ color: 'var(--md-on-surface)', opacity: 0.8, paddingLeft: '0.75rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, opacity: 0.4 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="px-5 pb-3 text-right" style={{ borderTop: '1px solid var(--md-outline-variant)' }}>
          <a href="https://ff.web.sdo.com/web8/index.html#/newstab/newscont/387965"
            target="_blank" rel="noopener noreferrer"
            className="text-xs" style={{ color: 'var(--md-primary)', opacity: 0.8 }}>
            查看完整更新说明 →
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function DashboardSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-6">
      <div className="bento-grid">

        {/* ① Version banner — fixed size */}
        <div className="bento-cell bento-banner">
          <VersionBanner />
        </div>

        {/* ② Activity cards — Progressive Disclosure pills, auto-fit sub-grid */}
        <div className="bento-cell bento-acts">
          <div className="acts-grid">
            <ActivityCard
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
            />
            <ActivityCard
              accent="#F4C161"
              badge="季节活动"
              title="金碟嘉年华 2026"
              dates={['5月29日 16:00 – 6月24日 22:59']}
              rows={[{ label: '距结束', target: T_GOLD_SAU_END, expired: '已结束' }]}
              url="https://actff1.web.sdo.com/project/20260519the_make_it_rain_campaign/86z02yp9k67o/index.html"
            />
            <ActivityCard
              accent="#FFAB76"
              badge="运营活动"
              title="黄金的试炼 第66期"
              subtitle="修行古刹星导寺"
              rows={[
                { label: '挑战期', target: T_TRIAL_CH_END,  expired: '已截止' },
                { label: '登记期', target: T_TRIAL_REG_END, expired: '已截止' },
              ]}
              url="https://actff1.web.sdo.com/20241130_GoldTrial/#/index"
            />
            {/* Add or remove ActivityCard here freely — layout auto-reflows */}
          </div>
        </div>

        {/* ③ World Cup — Progressive Disclosure pill strip */}
        <div className="bento-cell bento-wc">
          <PredictionsStrip
            accent="#4CAF50"
            badge="运营活动"
            title="世界杯竞猜"
            url="https://actff1.web.sdo.com/20240520_NewJingCai/index.html#/index"
            predictions={[
              { homeFlag: '🇨🇦', homeName: '加拿大',   awayFlag: '🇧🇦', awayName: '波黑',   homeWin: 45, draw: 28, awayWin: 27, deadline: T_BET_CAN_BIH },
              { homeFlag: '🇺🇸', homeName: '美国',     awayFlag: '🇵🇾', awayName: '巴拉圭', homeWin: 55, draw: 25, awayWin: 20, deadline: T_BET_USA_PAR },
              { homeFlag: '🇧🇷', homeName: '巴西',     awayFlag: '🇲🇦', awayName: '摩洛哥', homeWin: 50, draw: 30, awayWin: 20, deadline: T_BET_BRA_MAR },
              { homeFlag: '🇭🇹', homeName: '海地',     awayFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', awayName: '苏格兰', homeWin: 15, draw: 25, awayWin: 60, deadline: T_BET_HAI_SCO },
              { homeFlag: '🇦🇺', homeName: '澳大利亚', awayFlag: '🇹🇷', awayName: '土耳其', homeWin: 30, draw: 30, awayWin: 40, deadline: T_BET_AUS_TUR },
            ]}
          />
        </div>

        {/* ④ Fortune + Frontline — fixed size 2-col sub-grid */}
        <div className="bento-cell bento-bottom">
          <div className="bottom-grid">
            <DailyFortune noWrap />
            <FrontlineSchedule noWrap />
          </div>
        </div>

        {/* ⑤ News sidebar — fixed, spans all rows on desktop */}
        <div className="bento-cell bento-news flex flex-col">
          <NewsBoard noWrap />
        </div>

      </div>
    </div>
  )
}
