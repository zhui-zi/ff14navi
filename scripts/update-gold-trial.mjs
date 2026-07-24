import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const OFFICIAL_API =
  'https://actff1.web.sdo.com/20241130_GoldTrial/Handler/Config/Active/GetCurrentActive.ashx'
const OUTPUT = resolve('src/data/goldTrial.js')

function toCstIso(value) {
  const match = String(value || '').match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{2}):(\d{2})$/,
  )
  if (!match) return null
  const [, year, month, day, hour, minute, second] = match.map(Number)
  return new Date(Date.UTC(year, month - 1, day, hour - 8, minute, second)).toISOString()
}

function normalize(payload) {
  if (String(payload?.result) !== '1') throw new Error(payload?.errMessage || 'invalid response')

  const current = payload.currentActive || {}
  const next = payload.nextActive || {}
  const now = toCstIso(payload.nowTime)
  const currentEnd = toCstIso(current.EndTime_Reward)
  const useNext = next.ActiveID && (!current.ActiveID || (now && currentEnd && now > currentEnd))
  const active = useNext ? next : current

  const result = {
    issue: String(active.ActiveName || '').trim(),
    territory: (payload.vTerri || [])
      .map(item => item.territory_name || item.territory_detail)
      .filter(Boolean)
      .join(' / '),
    challengeStart: toCstIso(active.StartTime_Terri),
    challengeEnd: toCstIso(active.EndTime_Terri),
    registrationStart: toCstIso(active.StartTime_Reward),
    registrationEnd: toCstIso(active.EndTime_Reward),
    drawTime: toCstIso(active.StartTime_Result),
  }

  if (!result.issue || !result.territory || Object.values(result).some(value => value === null)) {
    throw new Error('official response is missing activity fields')
  }
  return result
}

function serialize(data) {
  return `export default {
  issue: '${data.issue}',
  territory: '${data.territory.replaceAll("'", "\\'")}',
  challengeStart: '${data.challengeStart}',
  challengeEnd: '${data.challengeEnd}',
  registrationStart: '${data.registrationStart}',
  registrationEnd: '${data.registrationEnd}',
  drawTime: '${data.drawTime}',
}
`
}

const response = await fetch(OFFICIAL_API, {
  method: 'POST',
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; ff14navi-updater/1.0; +https://ff14.cafe)',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
  },
})
if (!response.ok) throw new Error(`official API returned HTTP ${response.status}`)

const content = serialize(normalize(await response.json()))
if (process.argv.includes('--check')) {
  const current = await readFile(OUTPUT, 'utf8')
  if (current !== content) {
    console.error('Golden Trial data is out of date')
    process.exitCode = 1
  } else {
    console.log('Golden Trial data is up to date')
  }
} else {
  await writeFile(OUTPUT, content)
  console.log('Updated src/data/goldTrial.js')
}
