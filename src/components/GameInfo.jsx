import { useCountdown } from '../hooks/useCountdown'

// All times CST (UTC+8)
const cst = (y, mo, d, h = 0, mi = 0) =>
  new Date(Date.UTC(y, mo - 1, d, h - 8, mi))

const T_PATCH_751     = cst(2026, 6,  2, 16,  0)
const T_GOLD_SAU_END  = cst(2026, 6, 24, 22, 59)
const T_STAR_END      = cst(2026, 6,  9, 22, 59)
const T_TRIAL_CH_END  = cst(2026, 5, 31, 23, 59)
const T_TRIAL_REG_END = cst(2026, 6,  4, 13,  0)

// ── Countdown display  ──────────────────────────────────────────────────────
// M3 Expressive: the countdown number is the hero — large, bold, monospace.
function Countdown({ target, expired, accentColor }) {
  const t = useCountdown(target)

  if (!t) {
    return (
      <span className="text-xs font-medium" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.7 }}>
        {expired}
      </span>
    )
  }

  const hh = String(t.h).padStart(2, '0')
  const mm = String(t.m).padStart(2, '0')
  const ss = String(t.s).padStart(2, '0')

  return (
    <span
      className="font-black tabular-nums leading-none"
      style={{ fontFamily: '"Orbitron", monospace', fontSize: '1.5rem', color: accentColor, letterSpacing: '0.02em' }}
    >
      {t.d > 0 && <>{t.d}<span style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 2px 0 1px' }}>天</span></>}
      {hh}:{mm}:{ss}
    </span>
  )
}

// ── Single countdown row (label + number) ────────────────────────────────────
function CountdownRow({ label, target, expired, accentColor }) {
  return (
    <div className="flex items-baseline gap-2 mt-1">
      {label && (
        <span className="text-xs flex-shrink-0" style={{ color: 'var(--md-on-surface-variant)' }}>
          {label}
        </span>
      )}
      <Countdown target={target} expired={expired} accentColor={accentColor} />
    </div>
  )
}

// ── Activity card ────────────────────────────────────────────────────────────
// M3 Expressive: Surface Container High + colored left-border accent + large type
function ActivityCard({ accent, badge, title, subtitle, dates, rows, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-3xl px-5 py-4 cursor-pointer"
      style={{
        background: 'var(--md-surface-container-high)',
        borderLeft: `4px solid ${accent}`,
        transition: 'transform 0.18s cubic-bezier(0.2,0,0,1), box-shadow 0.18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.22)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      {/* Badge — M3 Label Small */}
      <div className="text-xs font-bold mb-1.5 tracking-wide uppercase" style={{ color: accent }}>
        {badge}
      </div>

      {/* Title — M3 Title Medium */}
      <div className="font-bold leading-snug mb-0.5" style={{ fontSize: '0.95rem', color: 'var(--md-on-surface)' }}>
        {title}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="text-xs mb-1" style={{ color: 'var(--md-on-surface-variant)' }}>{subtitle}</div>
      )}

      {/* Date range — M3 Body Small */}
      {dates && dates.map((d, i) => (
        <div key={i} className="text-xs leading-relaxed" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.75 }}>
          {d}
        </div>
      ))}

      {/* Countdown rows — the "expressive" hero element */}
      {rows.map((r, i) => (
        <CountdownRow key={i} {...r} accentColor={accent} />
      ))}
    </a>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function GameInfo({ noWrap = false }) {
  const content = (
    <div className="space-y-3">

      {/* Version banner — M3 Primary Container filled card, compact */}
      <a
        href="https://actff1.web.sdo.com/project/20240927dawntrail/patch75/index.html"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 rounded-3xl px-5 py-4 cursor-pointer"
        style={{
          background: 'var(--md-primary-container)',
          color: 'var(--md-on-primary-container)',
          transition: 'filter 0.18s',
        }}
        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.06)'}
        onMouseLeave={e => e.currentTarget.style.filter = ''}
      >
        <span className="text-2xl select-none flex-shrink-0">🎮</span>
        <div className="flex-1 min-w-0">
          {/* Label Small */}
          <div className="text-xs font-bold tracking-widest uppercase mb-0.5 opacity-70">
            当前版本
          </div>
          {/* Display Small — the expressive element */}
          <div className="font-black leading-tight" style={{ fontSize: 'clamp(1.1rem,2.5vw,1.5rem)' }}>
            7.5 天际的行路
          </div>
        </div>
        <div className="hidden sm:block text-right flex-shrink-0">
          <div className="text-xs opacity-60">黎明之晓 · Dawntrail</div>
          <div className="text-xs opacity-45 mt-0.5">查看更新说明 →</div>
        </div>
      </a>

      {/* Activity grid — 2×2 on md+, 1 col on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <ActivityCard
          accent="#4DD0E1"
          badge="下个版本"
          title="7.51 版本"
          dates={['2026年6月2日 正式上线']}
          rows={[{ target: T_PATCH_751, expired: '已上线 ✓' }]}
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
          accent="#F48FB1"
          badge="运营活动"
          title="星辰祈愿"
          dates={['5月26日 23:00 – 6月9日 22:59']}
          rows={[{ label: '距结束', target: T_STAR_END, expired: '已结束' }]}
          url="https://actff1.web.sdo.com/20260301__StarPray/#/index"
        />

        <ActivityCard
          accent="#FFAB76"
          badge="运营活动"
          title="黄金的试炼 第65期"
          subtitle="水妖幻园多恩美格禁园"
          rows={[
            { label: '挑战期', target: T_TRIAL_CH_END,  expired: '已截止' },
            { label: '登记期', target: T_TRIAL_REG_END, expired: '已截止' },
          ]}
          url="https://actff1.web.sdo.com/20241130_GoldTrial/#/index"
        />
      </div>
    </div>
  )
  if (noWrap) return content
  return <div className="max-w-7xl mx-auto px-4 mb-6">{content}</div>
}
