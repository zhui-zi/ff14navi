import { useEffect, useState } from 'react'

const cst = (y, mo, d, h = 0, mi = 0) => new Date(Date.UTC(y, mo - 1, d, h - 8, mi))

const FALLBACK_ACTIVITIES = [
  {
    id: 'next-patch', accent: '#4DD0E1', badge: '下个版本', title: '8.0', subtitle: '预计2027年1月',
    dates: ['《银海之天舟》：预计2027年1月更新'], rows: [],
    url: 'https://actff1.web.sdo.com/project/20260425evercold/',
  },
  {
    id: 'gold-trial', accent: '#FFAB76', badge: '运营活动', title: '黄金的试炼 第87期', subtitle: '名门府邸静语庄园',
    dates: ['副本挑战期：每周五 13:00 – 周日 23:59'], rows: [],
    url: 'https://actff1.web.sdo.com/20241130_GoldTrial/#/index',
  },
  {
    id: 'card-plan', accent: '#F06292', badge: '国服运营活动', title: '月卡启航计划', subtitle: '首次购买月卡限时特惠',
    dates: ['活动时间：2026年7月25日 18:00 – 2027年2月1日 14:00'],
    rows: [{ label: '距结束', target: cst(2027, 2, 1, 14), expired: '已结束' }],
    url: 'https://actff1.web.sdo.com/20260704_CardBill/index.html#/index',
  },
  {
    id: 'card-gift', accent: '#AB80D7', badge: '国服运营活动', title: '月卡礼赠', subtitle: '累计月卡天数领取奖励',
    dates: ['活动时间：2026年7月25日 18:00 – 2026年11月20日 23:59'],
    rows: [{ label: '距结束', target: cst(2026, 11, 20, 23, 59), expired: '已结束' }],
    url: 'https://actff1.web.sdo.com/20260704_CardBill/gift/index.html#/index',
  },
]

function normalize(activity) {
  return {
    ...activity,
    rows: (activity.rows || []).map(row => ({ ...row, target: new Date(row.target) })),
  }
}

export function useWikiActivities() {
  const [activities, setActivities] = useState(FALLBACK_ACTIVITIES)

  useEffect(() => {
    let active = true
    fetch('/activities?source=huiji')
      .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json() })
      .then(data => {
        if (active && Array.isArray(data.activities) && data.activities.length > 0) {
          setActivities(data.activities.map(normalize))
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return activities
}
