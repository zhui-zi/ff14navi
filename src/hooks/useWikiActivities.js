import { useEffect, useState } from 'react'

const FALLBACK_ACTIVITIES = [
  {
    id: 'next-patch', accent: '#4DD0E1', badge: '下个版本', title: '版本7.58维护更新', subtitle: '灰机首页同步中',
    dates: ['维护开始时间由灰机首页自动同步'], rows: [],
    url: 'https://ff.web.sdo.com/web8/index.html#/newstab/newscont/394876',
  },
  {
    id: 'all-saints', accent: '#FFAB76', badge: '季节活动', title: '守护天节 2026', subtitle: '进行中',
    dates: ['活动状态和结束倒计时由灰机首页自动同步'], rows: [],
    url: 'https://actff1.web.sdo.com/project/20261005All_Saints_Wake/hjwff6jkcti4/index.html',
  },
  {
    id: 'fan-fest', accent: '#C39BFF', badge: '特别活动', title: 'FANFEST 2026 in 东京', subtitle: '进行中',
    dates: ['活动状态和结束倒计时由灰机首页自动同步'], rows: [],
    url: 'https://ff.web.sdo.com/web8/index.html#/newstab/newslist',
  },
  {
    id: 'magic-key', accent: '#81C784', badge: '运营活动', title: '魔光键影', subtitle: '进行中',
    dates: ['活动状态由灰机首页自动同步'], rows: [],
    url: 'https://ff.web.sdo.com/web8/index.html#/newstab/newslist',
  },
  {
    id: 'gold-trial', accent: '#FFAB76', badge: '运营活动', title: '黄金的试炼 第87期', subtitle: '进行中',
    dates: ['副本挑战期和登记期由灰机首页自动同步'], rows: [],
    url: 'https://actff1.web.sdo.com/20241130_GoldTrial/#/index',
  },
  {
    id: 'card-plan', accent: '#F06292', badge: '国服运营活动', title: '月卡启航计划', subtitle: '首次购买月卡限时特惠',
    dates: ['活动状态和结束倒计时由灰机首页自动同步'], rows: [],
    url: 'https://actff1.web.sdo.com/20260704_CardBill/index.html#/index',
  },
  {
    id: 'card-gift', accent: '#AB80D7', badge: '国服运营活动', title: '月卡礼赠', subtitle: '累计月卡天数领取奖励',
    dates: ['活动状态和结束倒计时由灰机首页自动同步'], rows: [],
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
