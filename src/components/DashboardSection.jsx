import { useState } from 'react'
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

// ── Countdown display ────────────────────────────────────────────────────────
function Countdown({ target, expired, accentColor }) {
  const t = useCountdown(target)
  if (!t) return (
    <span className="text-xs" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.5 }}>{expired}</span>
  )
  const hh = String(t.h).padStart(2, '0')
  const mm = String(t.m).padStart(2, '0')
  const ss = String(t.s).padStart(2, '0')
  return (
    <span className="tabular-nums leading-none" style={{
      fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
      fontWeight: 700, fontSize: '1.15rem', color: accentColor, whiteSpace: 'nowrap',
    }}>
      {t.d > 0 && (
        <span style={{ marginRight: 3 }}>
          {t.d}<span style={{ fontSize: '0.75rem', fontWeight: 500, marginLeft: 1 }}>d</span>
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
        <span className="text-xs flex-shrink-0" style={{ color: 'var(--md-on-surface-variant)', opacity: 0.65 }}>
          {label}
        </span>
      )}
      <Countdown target={target} expired={expired} accentColor={accentColor} />
    </div>
  )
}

// ── Activity card — fills bento cell height ──────────────────────────────────
function ActivityCard({ accent: rawAccent, badge, title, subtitle, dates, rows, url, compact }) {
  const { effective } = useTheme()
  const accent = effective === 'light' ? adaptForLight(rawAccent) : rawAccent
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col h-full rounded-3xl px-4 py-4 cursor-pointer"
      style={{
        background: `linear-gradient(155deg, ${accent}1A 0%, var(--md-surface-container) 50%)`,
        border: `1.5px solid ${accent}44`,
        transition: 'transform 0.26s cubic-bezier(0.34,1.56,0.64,1), border-color 0.18s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.018)'
        e.currentTarget.style.borderColor = `${accent}BB`
        e.currentTarget.style.boxShadow = `0 8px 24px ${accent}28`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.borderColor = `${accent}44`
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Badge */}
      <span className="inline-block self-start text-xs font-semibold px-2 py-0.5 rounded-full mb-2.5"
        style={{
          background: `${accent}22`,
          color: accent,
          letterSpacing: '0.04em',
        }}>
        {badge}
      </span>

      {/* Title */}
      <div className="font-bold leading-snug mb-1" style={{
        fontFamily: '"Noto Serif SC", serif',
        fontSize: '1rem',
        color: 'var(--md-on-surface)',
      }}>
        {title}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="text-xs leading-relaxed truncate mb-0.5" style={{
          color: 'var(--md-on-surface-variant)', opacity: 0.7,
        }}>
          {subtitle}
        </div>
      )}

      {/* Dates — pushed toward bottom */}
      <div className="mt-auto pt-2">
        {compact ? (
          <>
            {dates?.slice(0, 2).map((d, i) => (
              <div key={i} className="text-xs leading-relaxed"
                style={{ color: 'var(--md-on-surface-variant)', opacity: 0.5 }}>{d}</div>
            ))}
            {dates?.length > 2 && (
              <div className="text-xs mt-0.5" style={{ color: accent, opacity: 0.55 }}>
                +{dates.length - 2} 项内容
              </div>
            )}
          </>
        ) : (
          dates?.map((d, i) => (
            <div key={i} className="text-xs leading-relaxed"
              style={{ color: 'var(--md-on-surface-variant)', opacity: 0.5 }}>{d}</div>
          ))
        )}
        {rows?.map((r, i) => (
          <CountdownRow key={i} {...r} accentColor={accent} />
        ))}
      </div>
    </a>
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
    <div className="flex flex-col items-center px-2 py-3"
      style={{ background: 'var(--md-surface-container)' }}>
      <div className="flex items-center gap-1 mb-1">
        <span style={{ fontSize: '1.35rem', lineHeight: 1 }}>{homeFlag}</span>
        <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--md-on-surface-variant)', opacity: 0.3 }}>VS</span>
        <span style={{ fontSize: '1.35rem', lineHeight: 1 }}>{awayFlag}</span>
      </div>
      <div className="flex items-center justify-center gap-1 w-full mb-2.5">
        <span className="flex-1 text-right truncate"
          style={{ fontSize: '0.62rem', fontWeight: 500, color: 'var(--md-on-surface)', opacity: 0.8 }}>
          {homeName}
        </span>
        <span style={{ opacity: 0.2, fontSize: '0.5rem', flexShrink: 0 }}>·</span>
        <span className="flex-1 truncate"
          style={{ fontSize: '0.62rem', fontWeight: 500, color: 'var(--md-on-surface)', opacity: 0.8 }}>
          {awayName}
        </span>
      </div>
      <div className="w-full flex rounded-full overflow-hidden mb-1" style={{ height: 12 }}>
        {segments.map((s, i) => (
          <div key={i} style={{
            width: `${s.pct}%`, backgroundColor: s.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {s.pct >= 26 && (
              <span style={{ fontSize: '0.48rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                {s.pct}%
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between mb-2" style={{ padding: '0 1px' }}>
        {segments.map((s, i) => (
          <span key={i} style={{ fontSize: '0.56rem', fontWeight: 600, color: s.color }}>{s.pct}%</span>
        ))}
      </div>
      <span className="tabular-nums" style={{
        fontSize: '0.56rem', fontFamily: 'ui-monospace, monospace', fontWeight: 600,
        color: t ? accent : 'var(--md-on-surface-variant)',
        opacity: t ? 0.8 : 0.35,
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
      className="block rounded-3xl overflow-hidden cursor-pointer h-full"
      style={{
        border: `1.5px solid ${accent}44`,
        transition: 'border-color 0.18s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${accent}AA`
        e.currentTarget.style.boxShadow = `0 6px 20px ${accent}22`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${accent}44`
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5 flex-wrap"
        style={{
          background: `linear-gradient(90deg, ${accent}1E 0%, var(--md-surface-container) 55%)`,
          borderBottom: `1px solid ${accent}22`,
        }}>
        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: `${accent}28`, color: accent, letterSpacing: '0.04em' }}>
          {badge}
        </span>
        <span className="font-bold flex-shrink-0" style={{
          fontFamily: '"Noto Serif SC", serif',
          fontSize: '0.95rem', color: 'var(--md-on-surface)',
        }}>
          {title}
        </span>
        <span style={{ fontSize: '0.68rem', color: 'var(--md-on-surface-variant)', opacity: 0.4 }}>
          🤖 AI 概率预测
        </span>
        <span className="ml-auto flex-shrink-0 text-xs" style={{ color: accent, opacity: 0.6 }}>
          前往竞猜 →
        </span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(108px, 1fr))',
        gap: '1px',
        background: `${accent}20`,
      }}>
        {predictions.map((p, i) => (
          <MatchColumn key={i} {...p} accent={accent} />
        ))}
      </div>
    </a>
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
function VersionBanner() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative h-full" style={{ zIndex: open ? 50 : 'auto' }}>
      <div className="relative rounded-3xl h-full" style={{
        background: 'var(--md-primary-container)',
        border: '1.5px solid var(--md-primary)',
        color: 'var(--md-on-primary-container)',
      }}>
        <div
          className="flex items-center gap-4 px-5 py-4 cursor-pointer rounded-3xl h-full"
          style={{ transition: 'filter 0.18s ease' }}
          onClick={() => setOpen(v => !v)}
          onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.filter = '')}
        >
          {/* Version glyph */}
          <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--md-primary)', color: 'var(--md-on-primary)' }}>
            <span style={{ fontFamily: '"Noto Serif SC", serif', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '-0.02em' }}>
              7.51
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium mb-0.5" style={{ opacity: 0.55, letterSpacing: '0.06em' }}>
              CURRENT PATCH
            </div>
            <div className="font-bold leading-tight" style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
            }}>
              天际的行路
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3">
            <a href="https://ff.web.sdo.com/web8/index.html#/newstab/newscont/387965"
              target="_blank" rel="noopener noreferrer"
              className="text-xs opacity-45 hover:opacity-80"
              style={{ transition: 'opacity 0.15s', whiteSpace: 'nowrap' }}
              onClick={e => e.stopPropagation()}>
              更新说明 ↗
            </a>
            <span style={{
              display: 'inline-block',
              transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              opacity: 0.55, fontSize: '1.1rem',
            }}>▾</span>
          </div>
        </div>
      </div>

      {/* Patch notes dropdown */}
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
        transition: 'opacity 0.24s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
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

// ── Bento grid dashboard ──────────────────────────────────────────────────────
export default function DashboardSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-6">
      <div className="bento-grid">

        {/* Row 1: Version banner */}
        <div className="bento-cell bento-banner">
          <VersionBanner />
        </div>

        {/* Row 2: Activity cards */}
        <div className="bento-cell bento-c1 flex flex-col">
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
        </div>

        <div className="bento-cell bento-c2 flex flex-col">
          <ActivityCard
            accent="#F4C161"
            badge="季节活动"
            title="金碟嘉年华 2026"
            dates={['5月29日 16:00 – 6月24日 22:59']}
            rows={[{ label: '距结束', target: T_GOLD_SAU_END, expired: '已结束' }]}
            url="https://actff1.web.sdo.com/project/20260519the_make_it_rain_campaign/86z02yp9k67o/index.html"
          />
        </div>

        <div className="bento-cell bento-c3 flex flex-col">
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

        {/* Row 3: World Cup */}
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

        {/* Row 4: Fortune + Frontline (stretch to fill remaining height) */}
        <div className="bento-cell bento-fort flex flex-col">
          <DailyFortune noWrap />
        </div>

        <div className="bento-cell bento-front flex flex-col">
          <FrontlineSchedule noWrap />
        </div>

        {/* News sidebar: spans all rows on desktop */}
        <div className="bento-cell bento-news flex flex-col">
          <NewsBoard noWrap />
        </div>

      </div>
    </div>
  )
}
