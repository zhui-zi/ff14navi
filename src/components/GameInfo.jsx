import { useState } from 'react'
import { useCountdown } from '../hooks/useCountdown'
import { useGoldTrial } from '../hooks/useGoldTrial'
import { useTheme } from '../hooks/useTheme'
import { adaptForLight } from '../utils/color'

// Helper: enter times in CST (UTC+8); h - 8 converts to UTC for Date.UTC
const cst = (y, mo, d, h = 0, mi = 0) =>
  new Date(Date.UTC(y, mo - 1, d, h - 8, mi))

const T_DQX_END       = cst(2026, 7, 13, 22, 59)
const T_YOKAI_START   = cst(2026, 8,  4, 16,  0)
const T_YOKAI_END     = cst(2026, 10, 5, 22, 59)
const T_CARD_PLAN_END = cst(2027, 2,  1, 14,  0)
const T_CARD_GIFT_END = cst(2026, 11, 20, 23, 59)
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

// ── Patch notes data ─────────────────────────────────────────────────────────
const PATCH_756_NOTES = [
  {
    category: '全新内容',
    color: '#4DD0E1',
    items: [
      '追加全新主线任务与特职任务',
      '设限特职「驯兽师」等级上限为50级',
      '追加魔兽战斗内容「斗兽奇弈」',
      '昔日重现追加「金曦之遗辉」章节',
    ],
  },
  {
    category: '战斗调整',
    color: '#F87171',
    items: [
      '解除「阿卡狄亚零式登天斗技场重量级」每周限制',
      '超越之力直接生效，效果量提升12%',
      '「随机任务：团队任务」追加「温达斯：第三巡行」',
      '「亚拉戈记忆神典石」每周上限调整为900个',
    ],
  },
  {
    category: 'PvP / 活动',
    color: '#F4C161',
    items: [
      '星里路标第12轮系列赛开始',
      '追加全新坐骑、宠物、时尚配饰与面部配饰',
      '追加发型、家具、成就与冒险者铭牌装饰',
      '追加全新背景音乐、音效、语音与文本指令',
    ],
  },
  {
    category: '系统调整',
    color: '#A78BFA',
    items: [
      '部分服务器调整为优待服务器',
      '黑衣森林中央林区及7.56新增区域暂时分线',
      '「图莱尤拉」副本分线功能解除',
      '修复多项任务、战斗与系统问题',
    ],
  },
  {
    category: '斗兽奇弈',
    color: '#81C784',
    items: [
      '通过奇盘事件构成挑战不同战斗内容',
      '魔兽可训练成长，最高兽级25级',
      '开放「兽道」模式与全大区排行榜',
      '第1赛季自2026年9月24日起举办',
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
              7.56 天际的行路
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <a href="https://ff.web.sdo.com/web8/index.html#/newstab/newscont/392680"
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
          {PATCH_756_NOTES.map(section => (
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
          <a href="https://ff.web.sdo.com/web8/index.html#/newstab/newscont/392680"
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
  const goldTrial = useGoldTrial()
  const content = (
    <div className="space-y-3">
      <VersionBanner />

      {/* Regular activity cards — auto-fit so they always fill the row without empty cells */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
        <ActivityCard
          accent="#4DD0E1"
          badge="下个版本"
          title="8.0"
          subtitle="预计2027年1月"
          dates={[
            '《银海之天舟》：预计2027年1月更新',
            '全新系统：赛季制、战斗职业系统与扩展兵装系统',
            '角色自定义：色彩选择器、精细妆容与角色技能皮肤',
            '主线与野外：区域攻略顺序选择及自动平衡系统',
            '等级上限：100级→110级；追加防护职业坚城卫与远程物理职业',
            '全新舞台：第四世界、飞空艇区域与玩家主城法尔加斯',
            '战斗内容：全新迷宫、团队任务、绝境战、PvP与大型任务系列',
            '系统进化：陆行鸟搭档可加入小队挑战迷宫，并重做饲养系统',
          ]}
          rows={[]}
          compact
          url="https://actff1.web.sdo.com/project/20260425evercold/"
        />
        <ActivityCard
          accent="#FFD54F"
          badge="联动活动"
          title="妖怪手表"
          subtitle="艾欧泽亚大集合啦喵！"
          dates={[
            '活动时间：2026年8月4日 16:00 – 2026年10月5日 22:59',
            '收集妖怪徽章与传奇妖怪徽章',
            '奖励：妖怪宠物、联动武器与坐骑',
          ]}
          rows={[
            { label: '距开始', target: T_YOKAI_START, expired: '进行中' },
            { label: '距结束', target: T_YOKAI_END, expired: '已结束' },
          ]}
          url="https://actff1.web.sdo.com/project/20260715youkai-watch/vaz1gqm16a3h/mob.html"
        />
        <ActivityCard
          accent="#6BA4E8"
          badge="季节活动（复刻）"
          title="勇者斗恶龙X联动"
          dates={[
            '6月25日 16:00 – 7月13日 22:59',
            '装备：莽汉面具、史莱姆王帽子',
            '宠物：巨像丙',
            '肖像教材：勇者斗恶龙X',
          ]}
          rows={[{ label: '距结束', target: T_DQX_END, expired: '已结束' }]}
          url="https://actff1.web.sdo.com/project/20260616Theres_Golems_in_Those_Hills/0gqh4ij2nlt0/index.html"
        />
        <ActivityCard
          accent="#FFAB76"
          badge="运营活动"
          title={goldTrial.title}
          subtitle={goldTrial.subtitle}
          dates={goldTrial.dates}
          rows={goldTrial.rows}
          url="https://actff1.web.sdo.com/20241130_GoldTrial/#/index"
        />
        <ActivityCard
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
        />
        <ActivityCard
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
        />
      </div>

    </div>
  )
  if (noWrap) return content
  return <div className="max-w-7xl mx-auto px-4 mb-6">{content}</div>
}
