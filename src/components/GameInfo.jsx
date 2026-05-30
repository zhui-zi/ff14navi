import { useCountdown, fmtCountdown } from '../hooks/useCountdown'

// All times in CST (UTC+8)
const cst = (y, mo, d, h = 0, mi = 0) =>
  new Date(Date.UTC(y, mo - 1, d, h - 8, mi))

const PATCH_751    = cst(2026, 6,  2,  0,  0)
const END_GOLD_SAU = cst(2026, 6, 24, 22, 59)
const END_STAR     = cst(2026, 6,  9, 22, 59)
const END_TRIAL_CH = cst(2026, 5, 31, 23, 59)
const END_TRIAL_REG = cst(2026, 6,  4, 13,  0)

function Badge({ label, color }) {
  return (
    <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2"
      style={{ background: `${color}30`, color }}>
      {label}
    </span>
  )
}

function Countdown({ target, label, expired = '已结束' }) {
  const t = useCountdown(target)
  const str = fmtCountdown(t)
  if (!str) return (
    <div className="text-xs mt-1 opacity-60">{expired}</div>
  )
  return (
    <div className="mt-1">
      <span className="text-xs opacity-70">{label} </span>
      <span className="font-mono font-bold text-sm tabular-nums">{str}</span>
    </div>
  )
}

function InfoCard({ bg, textColor, badge, badgeColor, title, subtitle, dates, countdowns, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-3xl p-5 cursor-pointer"
      style={{
        background: `var(${bg})`,
        color: `var(${textColor})`,
        transition: 'transform 0.2s, filter 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.filter = 'brightness(1.08)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = '' }}
    >
      <Badge label={badge} color={`var(${textColor})`} />
      <div className="font-bold text-base leading-snug mb-1">{title}</div>
      {subtitle && <div className="text-xs opacity-70 mb-2">{subtitle}</div>}
      {dates && dates.map((d, i) => (
        <div key={i} className="text-xs opacity-65 leading-relaxed">{d}</div>
      ))}
      {countdowns && countdowns.map((c, i) => (
        <Countdown key={i} target={c.target} label={c.label} expired={c.expired} />
      ))}
    </a>
  )
}

export default function GameInfo() {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-6">
      {/* Version banner — full width */}
      <a
        href="https://actff1.web.sdo.com/project/20240927dawntrail/patch75/index.html"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 rounded-3xl p-5 mb-4 cursor-pointer"
        style={{
          background: 'var(--card-version-bg)',
          color: 'var(--card-version-text)',
          transition: 'filter 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
        onMouseLeave={e => e.currentTarget.style.filter = ''}
      >
        <div className="text-4xl select-none">🎮</div>
        <div>
          <Badge label="当前版本" color="var(--card-version-text)" />
          <div className="font-black text-xl leading-tight">7.5 天际的行路</div>
          <div className="text-xs opacity-65 mt-0.5">点击查看版本更新说明 →</div>
        </div>
        <div className="ml-auto text-right hidden sm:block">
          <div className="text-xs opacity-60 mb-1">黎明之晓 · Dawntrail</div>
          <div className="text-xs opacity-50">Final Fantasy XIV</div>
        </div>
      </a>

      {/* 2-column grid for the rest */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <InfoCard
          bg="--card-patch-bg" textColor="--card-patch-text"
          badge="下个版本"
          title="7.51 版本"
          subtitle="2026年6月2日 正式上线"
          countdowns={[{ target: PATCH_751, label: '距上线', expired: '已上线' }]}
          url="https://actff1.web.sdo.com/project/20240927dawntrail/patch75/index.html"
        />

        <InfoCard
          bg="--card-gold-bg" textColor="--card-gold-text"
          badge="季节活动"
          title="金碟嘉年华 2026"
          dates={[
            '2026年5月29日 16:00',
            '~ 2026年6月24日 22:59',
          ]}
          countdowns={[{ target: END_GOLD_SAU, label: '距结束', expired: '已结束' }]}
          url="https://actff1.web.sdo.com/project/20260519the_make_it_rain_campaign/86z02yp9k67o/index.html"
        />

        <InfoCard
          bg="--card-star-bg" textColor="--card-star-text"
          badge="运营活动"
          title="星辰祈愿"
          dates={[
            '2026年5月26日 23:00',
            '~ 2026年6月9日 22:59',
          ]}
          countdowns={[{ target: END_STAR, label: '距结束', expired: '已结束' }]}
          url="https://actff1.web.sdo.com/20260301__StarPray/#/index"
        />

        <InfoCard
          bg="--card-trial-bg" textColor="--card-trial-text"
          badge="运营活动"
          title="黄金的试炼 第65期"
          subtitle="水妖幻园多恩美格禁园"
          dates={[
            '挑战期：5/29–5/31 23:59',
            '登记期：5/29–6/4 13:00',
            '幸运抽取：6/4 13:00',
          ]}
          countdowns={[
            { target: END_TRIAL_CH,  label: '挑战期剩余', expired: '挑战已截止' },
            { target: END_TRIAL_REG, label: '登记期剩余', expired: '登记已截止' },
          ]}
          url="https://actff1.web.sdo.com/20241130_GoldTrial/#/index"
        />
      </div>
    </div>
  )
}
