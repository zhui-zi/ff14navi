import { useState } from 'react'
import { useCountdown } from '../hooks/useCountdown'
import { useTheme } from '../hooks/useTheme'
import { adaptForLight } from '../utils/color'

// Helper: enter times in CST (UTC+8); h - 8 converts to UTC for Date.UTC
const cst = (y, mo, d, h = 0, mi = 0) =>
  new Date(Date.UTC(y, mo - 1, d, h - 8, mi))

const T_GOLD_SAU_END  = cst(2026, 6, 24, 22, 59)
const T_TRIAL_CH_END  = cst(2026, 6,  7, 23, 59)
const T_TRIAL_REG_END = cst(2026, 6, 11, 13,  0)
const T_BET_NED_JPN   = cst(2026, 6, 15,  4,  0)
const T_BET_CIV_ECU   = cst(2026, 6, 15,  7,  0)
const T_BET_SWE_TUN   = cst(2026, 6, 15, 10,  0)
const T_BET_AUS_TUR   = cst(2026, 6, 14, 12,  0)
// ── Shared countdown display ─────────────────────────────────────────────────
function Countdown({ target, expired, accentColor }) {
  const t = useCountdown(target)
  if (!t) return (
    <span className="text-xs" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.6 }}>{expired}</span>
  )
  const hh = String(t.h).padStart(2, '0')
  const mm = String(t.m).padStart(2, '0')
  const ss = String(t.s).padStart(2, '0')
  return (
    <span className="tabular-nums leading-none" style={{
      fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
      fontWeight: 700, fontSize: '1.25rem', color: accentColor,
      whiteSpace: 'nowrap', display: 'inline-block',
    }}>
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

// ── Regular activity card ────────────────────────────────────────────────────
function ActivityCard({ accent: rawAccent, badge, title, subtitle, dates, rows, url, compact }) {
  const { effective } = useTheme()
  const accent = effective === 'light' ? adaptForLight(rawAccent) : rawAccent
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl px-4 py-3.5 cursor-pointer"
      style={{
        background: `linear-gradient(160deg, ${accent}18 0%, var(--md-surface-container) 55%)`,
        border: `2px solid ${accent}55`,
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), border-color 0.18s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.015)'
        e.currentTarget.style.borderColor = `${accent}CC`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.borderColor = `${accent}55`
      }}
    >
      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded mb-2"
        style={{ backgroundColor: `${accent}22`, color: accent }}>
        {badge}
      </span>
      <div className="font-semibold leading-snug mb-1" style={{ fontSize: '0.9rem', color: 'var(--md-on-surface)' }}>
        {title}
      </div>
      {subtitle && (
        <div className="text-xs mb-1 truncate" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.75 }}>
          {subtitle}
        </div>
      )}
      {compact ? (
        <div className="mt-1">
          {dates?.slice(0, 2).map((d, i) => (
            <div key={i} className="text-xs leading-relaxed truncate"
              style={{ color: 'var(--md-on-surface-variant)', opacity: 0.55 }}>{d}</div>
          ))}
          {dates?.length > 2 && (
            <div className="text-xs mt-0.5" style={{ color: accent, opacity: 0.85 }}>
              +{dates.length - 2} 项内容
            </div>
          )}
        </div>
      ) : (
        dates?.map((d, i) => (
          <div key={i} className="text-xs leading-relaxed"
            style={{ color: 'var(--md-on-surface-variant)', opacity: 0.55 }}>{d}</div>
        ))
      )}
      {rows.map((r, i) => (
        <CountdownRow key={i} {...r} accentColor={accent} />
      ))}
    </a>
  )
}

function MatchColumn({ homeFlag, homeName, awayFlag, awayName, homeWin, draw, awayWin, accent, deadline }) {
  const t = useCountdown(deadline)
  const cd = t
    ? `${t.d > 0 ? t.d + 'd ' : ''}${String(t.h).padStart(2, '0')}:${String(t.m).padStart(2, '0')}:${String(t.s).padStart(2, '0')}`
    : '已截止'
  const segments = [
    { pct: homeWin, color: accent },
    { pct: draw,    color: 'var(--md-on-surface-variant)' },
    { pct: awayWin, color: '#F87171' },
  ]
  return (
    <div className="flex flex-col items-center px-2 py-3"
      style={{ background: 'var(--md-surface-container)' }}>
      {/* Flags */}
      <div className="flex items-center gap-1 mb-1">
        <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{homeFlag}</span>
        <span style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--md-on-surface-variant)', opacity: 0.3 }}>VS</span>
        <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{awayFlag}</span>
      </div>
      {/* Names */}
      <div className="flex items-center justify-center gap-1 w-full mb-2.5">
        <span className="flex-1 text-right truncate"
          style={{ fontSize: '0.63rem', fontWeight: 500, color: 'var(--md-on-surface)', opacity: 0.8 }}>
          {homeName}
        </span>
        <span style={{ opacity: 0.25, fontSize: '0.5rem', flexShrink: 0 }}>·</span>
        <span className="flex-1 truncate"
          style={{ fontSize: '0.63rem', fontWeight: 500, color: 'var(--md-on-surface)', opacity: 0.8 }}>
          {awayName}
        </span>
      </div>
      {/* Bar */}
      <div className="w-full flex rounded-full overflow-hidden mb-1" style={{ height: 13 }}>
        {segments.map((s, i) => (
          <div key={i} style={{
            width: `${s.pct}%`, backgroundColor: s.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'width 0.4s ease',
          }}>
            {s.pct >= 26 && (
              <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                {s.pct}%
              </span>
            )}
          </div>
        ))}
      </div>
      {/* Pct labels */}
      <div className="w-full flex justify-between mb-2" style={{ padding: '0 1px' }}>
        {segments.map((s, i) => (
          <span key={i} style={{ fontSize: '0.58rem', fontWeight: 600, color: s.color }}>{s.pct}%</span>
        ))}
      </div>
      {/* Countdown */}
      <span className="tabular-nums" style={{
        fontSize: '0.58rem', fontFamily: 'ui-monospace, monospace', fontWeight: 600,
        color: t ? accent : 'var(--md-on-surface-variant)',
        opacity: t ? 0.85 : 0.35,
      }}>
        ⏱ {cd}
      </span>
    </div>
  )
}

function PredictionsStrip({ accent: rawAccent, badge, title, url, predictions }) {
  const { effective } = useTheme()
  const accent = effective === 'light' ? adaptForLight(rawAccent) : rawAccent
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl overflow-hidden cursor-pointer"
      style={{
        border: `2px solid ${accent}55`,
        transition: 'border-color 0.18s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${accent}BB`}
      onMouseLeave={e => e.currentTarget.style.borderColor = `${accent}55`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 flex-wrap"
        style={{
          background: `linear-gradient(90deg, ${accent}20 0%, var(--md-surface-container) 60%)`,
          borderBottom: `1px solid ${accent}22`,
        }}>
        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded flex-shrink-0"
          style={{ backgroundColor: `${accent}28`, color: accent }}>
          {badge}
        </span>
        <span className="font-semibold flex-shrink-0" style={{ fontSize: '0.9rem', color: 'var(--md-on-surface)' }}>
          {title}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--md-on-surface-variant)', opacity: 0.45 }}>
          🤖 AI 概率预测
        </span>
        <span className="ml-auto flex-shrink-0" style={{ fontSize: '0.7rem', color: accent, opacity: 0.85 }}>
          前往竞猜 →
        </span>
      </div>
      {/* Match columns — gap via 1px background */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: '1px',
        background: `${accent}22`,
      }}>
        {predictions.map((p, i) => (
          <MatchColumn key={i} {...p} accent={accent} />
        ))}
      </div>
    </a>
  )
}

// ── Patch notes data ─────────────────────────────────────────────────────────
const PATCH_751_NOTES = [
  {
    category: '绝境战',
    color: '#F87171',
    items: [
      '追加「妖星乱舞绝境战」',
      '完成零式登天斗技场重量级4后开放',
      '8人组队，限时120分钟',
      '通关可换取绝境战专属武器',
    ],
  },
  {
    category: '宇宙探索',
    color: '#4DD0E1',
    items: [
      '追加全新星球「奥克塞西亚行星」',
      '追加熟练度探索任务（需宇宙工具满级）',
      '宇宙工具可进一步强化',
      '追加奥克塞西亚信用点与探索计划票据',
    ],
  },
  {
    category: '老主顾交易',
    color: '#F4C161',
    items: [
      '追加老主顾「缇索加」',
      '可获得金币、经验值、巧手/大地票据',
      '每周共可进行12次交易',
      '完成主线「明日的路标」后开放',
    ],
  },
  {
    category: '道具 / 系统',
    color: '#A78BFA',
    items: [
      '染色系统：7种色素整合为统一「色素」',
      '追加新坐骑、宠物、时尚配饰',
      '追加新情感动作与九宫幻卡',
      '肖像追加新装饰与可设置动作',
    ],
  },
  {
    category: '房屋 / 其他',
    color: '#81C784',
    items: [
      '家具超400件时临时停用隐藏机制',
      '新增支线任务（宇宙探索相关）',
      '追加全新制作配方与采集道具',
      '修复多项职业技能与副本问题',
    ],
  },
]

// ── Version banner ───────────────────────────────────────────────────────────
function VersionBanner() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" style={{ zIndex: open ? 20 : 'auto' }}>
      <div className="relative rounded-2xl" style={{
        background: 'var(--md-primary-container)',
        border: '2px solid var(--md-primary)',
        color: 'var(--md-on-primary-container)',
      }}>
        <div
          className="flex items-center gap-4 px-5 py-3.5 cursor-pointer rounded-2xl"
          style={{ minHeight: '4.5rem', transition: 'filter 0.18s ease' }}
          onClick={() => setOpen(v => !v)}
          onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.filter = '')}
        >
          <div className="flex-1 min-w-0">
            <div className="text-xs mb-0.5 opacity-55">当前版本</div>
            <div className="font-bold leading-tight"
              style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)' }}>
              7.51 天际的行路
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <a href="https://ff.web.sdo.com/web8/index.html#/newstab/newscont/387965"
              target="_blank" rel="noopener noreferrer"
              className="text-xs opacity-50 hover:opacity-90"
              style={{ transition: 'opacity 0.15s' }}
              onClick={e => e.stopPropagation()}>
              更新说明 ↗
            </a>
            <span className="text-lg select-none" style={{
              display: 'inline-block',
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              opacity: 0.6,
            }}>▾</span>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 50,
        borderRadius: '1rem',
        background: 'var(--md-surface-container-highest)',
        border: '2px solid var(--md-primary)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(-8px)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div className="px-5 pt-3 pb-4 grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
          {PATCH_751_NOTES.map(section => (
            <div key={section.category}>
              <div className="text-xs font-semibold mb-1.5 px-2 py-0.5 rounded-full inline-block"
                style={{ backgroundColor: `${section.color}28`, color: section.color }}>
                {section.category}
              </div>
              <ul className="space-y-1">
                {section.items.map((item, i) => (
                  <li key={i} className="text-xs leading-snug"
                    style={{ color: 'var(--md-on-surface)', opacity: 0.8, paddingLeft: '0.75rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, opacity: 0.45 }}>·</span>
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

// ── Main component ───────────────────────────────────────────────────────────
export default function GameInfo({ noWrap = false }) {
  const content = (
    <div className="space-y-3">
      <VersionBanner />

      {/* Regular activity cards — auto-fit so they always fill the row without empty cells */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
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
      </div>

      {/* World Cup predictions — full-width horizontal strip, one column per match */}
      <PredictionsStrip
        accent="#4CAF50"
        badge="运营活动"
        title="世界杯竞猜"
        url="https://actff1.web.sdo.com/20240520_NewJingCai/index.html#/index"
        predictions={[
          { homeFlag: '🇳🇱', homeName: '荷兰',     awayFlag: '🇯🇵', awayName: '日本',     homeWin: 55, draw: 25, awayWin: 20, deadline: T_BET_NED_JPN },
          { homeFlag: '🇨🇮', homeName: '科特迪瓦', awayFlag: '🇪🇨', awayName: '厄瓜多尔', homeWin: 35, draw: 30, awayWin: 35, deadline: T_BET_CIV_ECU },
          { homeFlag: '🇸🇪', homeName: '瑞典',     awayFlag: '🇹🇳', awayName: '突尼斯',   homeWin: 50, draw: 30, awayWin: 20, deadline: T_BET_SWE_TUN },
          { homeFlag: '🇦🇺', homeName: '澳大利亚', awayFlag: '🇹🇷', awayName: '土耳其', homeWin: 30, draw: 30, awayWin: 40, deadline: T_BET_AUS_TUR },
        ]}
      />
    </div>
  )
  if (noWrap) return content
  return <div className="max-w-7xl mx-auto px-4 mb-6">{content}</div>
}
