import { useState, useRef, useEffect, useCallback } from 'react'
import { useCountdown } from '../hooks/useCountdown'
import { useGoldTrial } from '../hooks/useGoldTrial'
import { useTheme } from '../hooks/useTheme'
import { adaptForLight } from '../utils/color'
import NewsBoard from './NewsBoard'
import DailyFortune from './DailyFortune'
import FrontlineSchedule from './FrontlineSchedule'

// ── CST time helpers ──────────────────────────────────────────────────────────
const cst = (y, mo, d, h = 0, mi = 0) =>
  new Date(Date.UTC(y, mo - 1, d, h - 8, mi))

const T_PATCH_755         = cst(2026, 7, 28, 18,  0)
const T_SUMMER_START      = cst(2026, 7, 25,  0,  0)
const T_SUMMER_END        = cst(2026, 8,  9, 23, 59)
const T_CARD_PLAN_END     = cst(2027, 2,  1, 14,  0)
const T_CARD_GIFT_END     = cst(2026, 11, 20, 23, 59)

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const EASE   = 'cubic-bezier(0.4, 0, 0.2, 1)'

// Consistent with rounded-3xl used across all cards
const CARD_R = '1.5rem'

// ── Compact inline countdown for pill row 2 ───────────────────────────────────
function CountdownCompact({ target, expired, daysOnly }) {
  const t = useCountdown(target)
  if (!t) return (
    <span style={{ opacity: 'var(--t-faint)', fontSize: '0.7rem', fontWeight: 500 }}>{expired}</span>
  )
  if (daysOnly) {
    const days = (t.h || t.m || t.s) ? t.d + 1 : t.d
    return (
      <span className="tabular-nums" style={{
        fontFamily: 'ui-monospace, "Cascadia Code", monospace',
        fontSize: '0.72rem', fontWeight: 700,
      }}>
        {days}天
      </span>
    )
  }
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
function CountdownRow({ label, target, expired, accentColor, daysOnly }) {
  const t = useCountdown(target)
  const days = t && (t.h || t.m || t.s) ? t.d + 1 : t?.d
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
      {label && (
        <span style={{ fontSize: '0.72rem', color: 'var(--md-on-surface-variant)', opacity: 'var(--t-label)', flexShrink: 0 }}>
          {label}
        </span>
      )}
      {t ? (
        <span className="tabular-nums" style={{
          fontFamily: 'ui-monospace, "Cascadia Code", monospace',
          fontWeight: 700, fontSize: '1.15rem', color: accentColor, whiteSpace: 'nowrap',
        }}>
          {daysOnly ? (
            `${days}天`
          ) : (
            <>
              {t.d > 0 && (
                <span style={{ marginRight: 3 }}>
                  {t.d}<span style={{ fontSize: '0.7rem', fontWeight: 500, marginLeft: 1 }}>d</span>
                </span>
              )}
              {String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}:{String(t.s).padStart(2, '0')}
            </>
          )}
        </span>
      ) : (
        <span style={{ fontSize: '0.75rem', color: 'var(--md-on-surface-variant)', opacity: 0.5 }}>{expired}</span>
      )}
    </div>
  )
}

// ── Shared toggle indicator — M3 Expressive pill chip, purely visual ──────────
function ToggleBtn({ open, accent }) {
  return (
    <div
      aria-hidden="true"
      style={{
        flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        height: '1.375rem',
        padding: '0 0.45rem',
        borderRadius: '9999px',
        background: open ? `${accent}2A` : `${accent}14`,
        border: `1.5px solid ${open ? accent + '55' : accent + '28'}`,
        color: accent,
        pointerEvents: 'none',
        transition: [
          `background 0.22s ${EASE}`,
          `border-color 0.22s ${EASE}`,
        ].join(', '),
      }}
    >
      <svg
        width="9" height="9" viewBox="0 0 9 9"
        fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        style={{
          display: 'block',
          transition: `transform 0.42s ${SPRING}`,
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transformOrigin: 'center',
        }}
      >
        <path d="M2.5 1.5 L6.5 4.5 L2.5 7.5" />
      </svg>
    </div>
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
        flex: 1,
        padding: '0.55rem 0.625rem 0.55rem 0.875rem',
        borderRadius: CARD_R,
        background: open
          ? `linear-gradient(135deg, ${accent}2E 0%, var(--md-surface-container) 55%)`
          : `linear-gradient(135deg, ${accent}1E 0%, var(--md-surface-container) 60%)`,
        border: `1.5px solid ${open ? accent + 'BB' : accent + '50'}`,
        cursor: 'pointer',
        outline: 'none',
        userSelect: 'none',
        maxWidth: '100%',
        overflow: 'hidden',
        transition: [
          `background 0.25s ${EASE}`,
          `border-color 0.2s ${EASE}`,
        ].join(', '),
      }}
      onMouseEnter={e => {
        if (!open) e.currentTarget.style.borderColor = `${accent}88`
      }}
      onMouseLeave={e => {
        if (!open) e.currentTarget.style.borderColor = `${accent}50`
      }}
    >
      {/* Row 1: dot + title + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: accent, flexShrink: 0, opacity: 0.85,
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
        <ToggleBtn open={open} accent={accent} />
      </div>

      {/* Row 2: badge + secondary info (injected via children) */}
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: '0.375rem',
        paddingLeft: '1.1875rem', marginTop: '0.2rem',
      }}>
        <span style={{
          fontSize: '0.6rem', fontWeight: 700,
          color: accent, opacity: 'var(--t-label)',
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
function ActivityCapsule({ accent: rawAccent, badge, title, subtitle, dates, rows, url, compact, open, onToggle, onHoverOpen, onHoverClose }) {
  const bodyRef = useRef(null)
  const [bodyH, setBodyH] = useState(0)
  const [elevated, setElevated] = useState(false)
  const { effective } = useTheme()
  const accent = effective === 'light' ? adaptForLight(rawAccent) : rawAccent
  const panelShadow = effective === 'light' ? 'none' : '0 8px 28px rgba(0,0,0,0.38)'
  const wasTouchRef = useRef(false)
  const touchResetRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) setBodyH(bodyRef.current.scrollHeight)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep z-index elevated during closing animation so panel doesn't clip behind sibling cells
  useEffect(() => {
    if (open) {
      setElevated(true)
    } else {
      const t = setTimeout(() => setElevated(false), 450)
      return () => clearTimeout(t)
    }
  }, [open])

  // useCountdown keeps this component ticking so the next live stage is promoted immediately
  useCountdown(rows?.[0]?.target)
  const primaryRow = rows?.find(row => new Date(row.target).getTime() > Date.now())
    ?? rows?.[rows.length - 1]

  return (
    <div
      style={{ position: 'relative', zIndex: elevated ? 1 : 0, display: 'flex', flexDirection: 'column' }}
      onTouchStart={() => { clearTimeout(touchResetRef.current); wasTouchRef.current = true }}
      onTouchEnd={() => { touchResetRef.current = setTimeout(() => { wasTouchRef.current = false }, 600) }}
      onMouseEnter={() => { if (!wasTouchRef.current) onHoverOpen?.() }}
      onMouseLeave={() => { if (!wasTouchRef.current) onHoverClose?.() }}
    >
      <CapsulePill
        accent={accent}
        badge={primaryRow?.label ?? badge}
        title={title}
        open={open}
        onToggle={onToggle}
      >
        {primaryRow && (
          <span style={{ color: accent }}>
            <CountdownCompact target={primaryRow.target} expired={primaryRow.expired} daysOnly={primaryRow.daysOnly} />
          </span>
        )}
      </CapsulePill>

      {/* Bridge div — transparent, covers the gap so mouseleave doesn't fire mid-transition */}
      <div style={{
        position: 'absolute', top: '100%', left: 0, right: 0,
        height: '8px', pointerEvents: open ? 'auto' : 'none',
      }} />

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
            background: 'var(--md-surface-container-high)',
            border: `1.5px solid ${accent}44`,
            boxShadow: panelShadow,
          }}
        >
          {/* Subtitle chip */}
          {subtitle && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.2rem 0.625rem 0.2rem 0.45rem',
              borderRadius: '0.5rem',
              background: `${accent}14`,
              border: `1px solid ${accent}30`,
              marginBottom: '0.625rem',
            }}>
              <span style={{ color: accent, fontSize: '0.58rem', opacity: 0.85, lineHeight: 1 }}>◈</span>
              <span style={{
                fontSize: '0.74rem', fontWeight: 500,
                color: 'var(--md-on-surface-variant)',
              }}>
                {subtitle}
              </span>
            </div>
          )}

          {/* Info block — each item auto-parsed: "label：value" gets label+value columns, otherwise bullet */}
          {dates?.length > 0 && (
            <div style={{
              borderRadius: '0.625rem',
              background: `${accent}08`,
              border: `1px solid ${accent}1E`,
              padding: '0.5rem 0.625rem',
              marginBottom: rows?.length ? '0.5rem' : 0,
              display: 'flex', flexDirection: 'column', gap: '0.3rem',
            }}>
              {dates.map((d, i) => {
                const sep = d.indexOf('：')
                const hasLabel = sep > 0 && sep <= 8
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    {hasLabel ? (
                      <span style={{
                        fontSize: '0.63rem', fontWeight: 600,
                        color: accent, opacity: 0.8,
                        flexShrink: 0, lineHeight: 1.55,
                        minWidth: '4.25rem',
                      }}>
                        {d.slice(0, sep)}
                      </span>
                    ) : (
                      <span style={{
                        color: accent, opacity: 0.65, fontSize: '0.55rem',
                        flexShrink: 0, lineHeight: 1, paddingTop: '0.25rem',
                      }}>
                        ▸
                      </span>
                    )}
                    <span style={{
                      fontSize: '0.72rem', lineHeight: 1.55,
                      color: 'var(--md-on-surface-variant)', opacity: 0.8,
                    }}>
                      {hasLabel ? d.slice(sep + 1) : d}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

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
function VersionBanner({ open, onToggle }) {
  const { effective } = useTheme()
  const panelShadow = effective === 'light' ? 'none' : '0 12px 40px rgba(0,0,0,0.50)'

  const toggle = () => onToggle?.(!open)

  return (
    <div className="relative">
      <div className="relative rounded-3xl" style={{
        background: 'var(--md-primary-container)',
        border: '1.5px solid var(--md-primary)',
        color: 'var(--md-on-primary-container)',
      }}>
        <div
          className="flex items-center gap-4 px-5 cursor-pointer rounded-3xl"
          style={{ minHeight: '6.5rem', padding: '1.5rem 1.25rem', transition: `filter 0.18s ${EASE}` }}
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
        boxShadow: panelShadow,
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
  const goldTrial = useGoldTrial()
  const [openId,     setOpenId]     = useState(null)
  const [bannerOpen, setBannerOpen] = useState(false)
  const [actsZ,   setActsZ]   = useState(false)
  const [bannerZ, setBannerZ] = useState(false)
  const actsTimerRef   = useRef(null)
  const closeTimerRef  = useRef(null)
  const bannerTimerRef = useRef(null)

  // Banner toggle — closes all activity panels; z-index held during close animation
  const handleBannerToggle = useCallback((next) => {
    setBannerOpen(next)
    clearTimeout(bannerTimerRef.current)
    if (next) {
      setBannerZ(true)
      // close any open activity panel
      setOpenId(null)
      clearTimeout(actsTimerRef.current)
      actsTimerRef.current = setTimeout(() => setActsZ(false), 500)
    } else {
      bannerTimerRef.current = setTimeout(() => setBannerZ(false), 400)
    }
  }, [])

  // Click toggle — closes banner; keeps touch/keyboard working
  const toggle = useCallback((id) => {
    clearTimeout(closeTimerRef.current)
    // close banner if open
    setBannerOpen(false)
    clearTimeout(bannerTimerRef.current)
    bannerTimerRef.current = setTimeout(() => setBannerZ(false), 400)
    setOpenId(v => {
      const next = v === id ? null : id
      clearTimeout(actsTimerRef.current)
      if (next) { setActsZ(true) }
      else { actsTimerRef.current = setTimeout(() => setActsZ(false), 500) }
      return next
    })
  }, [])

  // Hover open — closes banner; immediate
  const openPanel = useCallback((id) => {
    clearTimeout(closeTimerRef.current)
    setBannerOpen(false)
    clearTimeout(bannerTimerRef.current)
    bannerTimerRef.current = setTimeout(() => setBannerZ(false), 400)
    setOpenId(id)
    clearTimeout(actsTimerRef.current)
    setActsZ(true)
  }, [])

  // Hover close — 200 ms delay to bridge the pill→panel gap
  const closePanel = useCallback((id) => {
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setOpenId(v => v === id ? null : v)
      actsTimerRef.current = setTimeout(() => setActsZ(false), 500)
    }, 200)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 mb-6">
      <div className="bento-grid">

        {/* ① Activity capsule row — z-index 60 > banner's 50, delayed so closing panels don't clip */}
        <div className="bento-cell bento-acts" style={{ zIndex: actsZ ? 60 : 0 }}>
          <div className="acts-grid">
            <ActivityCapsule
              accent="#4DD0E1"
              badge="下个版本"
              title="7.55"
              subtitle="7月28日 18:00"
              dates={[
                '大型战斗任务「蜃景幻境新月岛北征之章」',
                '武器强化任务「幻境武器」',
                '非著名调查员 金曦之章',
                '友好部族盟友任务 金曦之章',
              ]}
              rows={[{ label: '距上线', target: T_PATCH_755, expired: '已上线' }]}
              compact
              url="https://actff1.web.sdo.com/project/20240927dawntrail/patch75/index.html"
              open={openId === 'next-patch'}
              onToggle={() => toggle('next-patch')}
              onHoverOpen={() => openPanel('next-patch')}
              onHoverClose={() => closePanel('next-patch')}
            />
            <ActivityCapsule
              accent="#FFAB76"
              badge="运营活动"
              title={goldTrial.title}
              subtitle={goldTrial.subtitle}
              dates={goldTrial.dates}
              rows={goldTrial.rows}
              url="https://actff1.web.sdo.com/20241130_GoldTrial/#/index"
              open={openId === 'gold-trial'}
              onToggle={() => toggle('gold-trial')}
              onHoverOpen={() => openPanel('gold-trial')}
              onHoverClose={() => closePanel('gold-trial')}
            />
            <ActivityCapsule
              accent="#F06292"
              badge="国服运营活动"
              title="月卡启航计划"
              subtitle="首次购买月卡限时特惠"
              dates={[
                '活动时间：2026年7月25日 18:00 – 2027年2月1日 14:00',
                '首次购买：30天月卡时长仅需4500点券',
                '持有月卡：活动期间可折扣购买月卡',
              ]}
              rows={[{ label: '距结束', target: T_CARD_PLAN_END, expired: '已结束' }]}
              url="https://actff1.web.sdo.com/20260704_CardBill/index.html#/index"
              open={openId === 'card-plan'}
              onToggle={() => toggle('card-plan')}
              onHoverOpen={() => openPanel('card-plan')}
              onHoverClose={() => closePanel('card-plan')}
            />
            <ActivityCapsule
              accent="#AB80D7"
              badge="国服运营活动"
              title="月卡礼赠"
              subtitle="累计月卡天数领取奖励"
              dates={[
                '活动时间：2026年7月25日 18:00 – 2026年11月20日 23:59',
                '参与条件：已消耗与剩余月卡天数之和达到要求',
                '奖励：肖像教材：随身神典石1&2',
              ]}
              rows={[{ label: '距结束', target: T_CARD_GIFT_END, expired: '已结束' }]}
              url="https://actff1.web.sdo.com/20260704_CardBill/gift/index.html#/index"
              open={openId === 'card-gift'}
              onToggle={() => toggle('card-gift')}
              onHoverOpen={() => openPanel('card-gift')}
              onHoverClose={() => closePanel('card-gift')}
            />
            <ActivityCapsule
              accent="#FF8A65"
              badge="线下活动"
              title="夏日庆典"
              subtitle="上海陆悦天地"
              dates={[
                '活动期间：7月25日 – 8月9日',
                '转播会抽选登记：6月26日 14:00 – 6月29日 14:00',
                '转播会抽选确认：6月29日 16:00 – 7月2日 16:00',
              ]}
              rows={[
                { label: '距开始', target: T_SUMMER_START, expired: '进行中', daysOnly: true },
                { label: '距结束', target: T_SUMMER_END,   expired: '已结束', daysOnly: true },
              ]}
              url="https://actff1.web.sdo.com/project/20260615summerfes/index.html#/index"
              open={openId === 'summer-fest'}
              onToggle={() => toggle('summer-fest')}
              onHoverOpen={() => openPanel('summer-fest')}
              onHoverClose={() => closePanel('summer-fest')}
            />
          </div>
        </div>

        {/* ② Version banner — z-index held during open + close animation */}
        <div className="bento-cell bento-banner" style={{ zIndex: bannerZ ? 50 : 0 }}>
          <VersionBanner open={bannerOpen} onToggle={handleBannerToggle} />
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
