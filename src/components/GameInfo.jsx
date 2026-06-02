import { useCountdown } from '../hooks/useCountdown'

// All times CST (UTC+8)
const cst = (y, mo, d, h = 0, mi = 0) =>
  new Date(Date.UTC(y, mo - 1, d, h - 8, mi))

const T_PATCH_751     = cst(2026, 6,  2, 16,  0)
const T_GOLD_SAU_END  = cst(2026, 6, 24, 22, 59)
const T_STAR_END      = cst(2026, 6,  9, 22, 59)
const T_TRIAL_CH_END  = cst(2026, 5, 31, 23, 59)
const T_TRIAL_REG_END = cst(2026, 6,  4, 13,  0)

function Countdown({ target, expired, accentColor }) {
  const t = useCountdown(target)

  if (!t) {
    return (
      <span className="text-xs" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.6 }}>
        {expired}
      </span>
    )
  }

  const hh = String(t.h).padStart(2, '0')
  const mm = String(t.m).padStart(2, '0')
  const ss = String(t.s).padStart(2, '0')

  return (
    <span
      className="tabular-nums leading-none"
      style={{
        fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
        fontWeight: 700,
        fontSize: '1.25rem',
        color: accentColor,
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {t.d > 0 && (
        <span style={{ marginRight: 4 }}>
          {t.d}<span style={{ fontSize: '0.8rem', fontWeight: 500, marginLeft: 1 }}>d</span>
        </span>
      )}
      {hh}:{mm}:{ss}
    </span>
  )
}

function CountdownRow({ label, target, expired, accentColor }) {
  return (
    <div className="flex items-baseline gap-2 mt-2">
      {label && (
        <span className="text-xs flex-shrink-0" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.7 }}>
          {label}
        </span>
      )}
      <Countdown target={target} expired={expired} accentColor={accentColor} />
    </div>
  )
}

function ActivityCard({ accent, badge, title, subtitle, dates, rows, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl px-4 py-3.5 cursor-pointer"
      style={{
        backgroundColor: 'var(--md-surface-container-high)',
        backgroundImage: `linear-gradient(160deg, ${accent}0d 0%, transparent 50%)`,
        border: `1.5px solid ${accent}`,
        boxShadow: `0 2px 8px rgba(0,0,0,0.1)`,
        transition: 'transform 0.18s ease, box-shadow 0.22s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 10px 28px rgba(0,0,0,0.22), 0 0 20px ${accent}3a`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = `0 2px 8px rgba(0,0,0,0.1)`
      }}
    >
      <span
        className="inline-block text-xs font-medium px-2 py-0.5 rounded mb-2"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        {badge}
      </span>

      <div className="font-semibold leading-snug mb-1" style={{ fontSize: '0.9rem', color: 'var(--md-on-surface)' }}>
        {title}
      </div>

      {subtitle && (
        <div className="text-xs mb-1 truncate" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.75 }}>{subtitle}</div>
      )}

      {dates?.map((d, i) => (
        <div key={i} className="text-xs leading-relaxed" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.55 }}>
          {d}
        </div>
      ))}

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

      <a
        href="https://actff1.web.sdo.com/project/20240927dawntrail/patch75/index.html"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-4 rounded-xl px-5 py-3.5 cursor-pointer overflow-hidden"
        style={{
          background: 'var(--md-primary-container)',
          color: 'var(--md-on-primary-container)',
          transition: 'filter 0.15s ease',
          minHeight: '4.5rem',
        }}
        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.07)'}
        onMouseLeave={e => e.currentTarget.style.filter = ''}
      >
        <div className="flex-1 min-w-0 z-10">
          <div className="text-xs mb-0.5 opacity-55">当前版本</div>
          <div
            className="font-bold leading-tight"
            style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)' }}
          >
            7.51 天际的行路
          </div>
        </div>
        <div className="relative flex-shrink-0 z-10 text-right">
          <div className="text-xs opacity-35">查看专题站➡️</div>
        </div>
      </a>

      {/* Activity grid — 2×2 on md+, 1 col on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <ActivityCard
          accent="#4DD0E1"
          badge="当前版本"
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
