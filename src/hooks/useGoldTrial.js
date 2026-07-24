import { useMemo } from 'react'
import goldTrial from '../data/goldTrial'

function formatCst(value) {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(value)
  const get = type => parts.find(part => part.type === type)?.value
  return `${get('month')}月${get('day')}日 ${get('hour')}:${get('minute')}`
}

function range(start, end) {
  return `${formatCst(start)} – ${formatCst(end)}`
}

export function useGoldTrial() {
  return useMemo(() => {
    const challengeStart = new Date(goldTrial.challengeStart)
    const challengeEnd = new Date(goldTrial.challengeEnd)
    const registrationStart = new Date(goldTrial.registrationStart)
    const registrationEnd = new Date(goldTrial.registrationEnd)
    const drawTime = new Date(goldTrial.drawTime)
    const rows = []

    if (challengeStart.getTime() > Date.now()) {
      rows.push({ label: '距开始', target: challengeStart, expired: '已开始' })
    }
    rows.push(
      { label: '挑战期', target: challengeEnd, expired: '已截止' },
      { label: '登记期', target: registrationEnd, expired: '已截止' },
    )

    return {
      title: `黄金的试炼 第${goldTrial.issue}期`,
      subtitle: goldTrial.territory,
      dates: [
        `副本挑战期：${range(challengeStart, challengeEnd)}`,
        `试炼登记期：${range(registrationStart, registrationEnd)}`,
        `幸运奖励抽取：${formatCst(drawTime)}`,
      ],
      rows,
    }
  }, [])
}
