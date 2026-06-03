import { useMemo, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { adaptForLight } from '../utils/color'

// Mulberry32 seeded PRNG
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h >>> 0
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)]
}

function pickWeighted(rand, arr) {
  const total = arr.reduce((s, x) => s + x.w, 0)
  let r = rand() * total
  for (const x of arr) { r -= x.w; if (r <= 0) return x }
  return arr[arr.length - 1]
}

// ── Data ────────────────────────────────────────────────────────────────────

const JOBS = [
  { name: '骑士',    role: 'tank',    color: '#64B5F6' },
  { name: '战士',    role: 'tank',    color: '#EF9A9A' },
  { name: '暗黑骑士', role: 'tank',    color: '#CE93D8' },
  { name: '绝枪战士', role: 'tank',    color: '#90A4AE' },
  { name: '白魔法师', role: 'healer',  color: '#E0E0E0' },
  { name: '学者',    role: 'healer',  color: '#7986CB' },
  { name: '占星术士', role: 'healer',  color: '#FFD54F' },
  { name: '贤者',    role: 'healer',  color: '#4DD0E1' },
  { name: '武僧',    role: 'melee',   color: '#FF8A65' },
  { name: '龙骑士',  role: 'melee',   color: '#5C9BD6' },
  { name: '忍者',    role: 'melee',   color: '#78909C' },
  { name: '武士',    role: 'melee',   color: '#EF5350' },
  { name: '钐镰客',  role: 'melee',   color: '#B0BEC5' },
  { name: '蝰蛇剑士', role: 'melee',   color: '#81C784' },
  { name: '吟游诗人', role: 'ranged',  color: '#AED581' },
  { name: '机工士',  role: 'ranged',  color: '#FFA726' },
  { name: '舞者',    role: 'ranged',  color: '#F48FB1' },
  { name: '黑魔法师', role: 'caster',  color: '#9575CD' },
  { name: '召唤师',  role: 'caster',  color: '#66BB6A' },
  { name: '赤魔法师', role: 'caster',  color: '#EF5350' },
  { name: '绘灵法师', role: 'caster',  color: '#FF8A65' },
]

const ROLE_LABEL = { tank: '坦克', healer: '治疗', melee: '近战', ranged: '远敏', caster: '法系' }

const DUNGEONS = [
  // 迷宫挑战（重生之境）
  '天然要害沙斯塔夏溶洞', '地下灵殿塔姆·塔拉墓园', '封锁坑道铜铃铜山',
  '魔兽领域日影地修炼所', '监狱废墟托托·拉克千狱', '名门府邸静语庄园',
  '休养胜地布雷福洛克斯野营地', '古代遗迹喀恩埋没圣堂', '流沙迷宫樵鸣洞',
  '对龙城塞石卫塔', '山中战线泽梅尔要塞', '毒雾洞窟黄金谷',
  '神灵圣域放浪神古神殿', '神兵要塞帝国南方堡', '最终决战天幕魔导城',
  '邪教驻地无限城古堡', '领航明灯天狼星灯塔', '骚乱坑道铜铃铜山',
  '恶灵府邸静语庄园', '腐坏遗迹无限城市街古迹', '剑斗领域日影地修炼所',
  '纷争要地布雷福洛克斯野营地', '财宝传说破舰岛', '惨剧灵殿塔姆·塔拉墓园',
  '激战城塞石卫塔', '凛冽洞天披雪大冰壁', '逆转要害沙斯塔夏溶洞',
  '苏醒遗迹喀恩埋没圣堂', '幻龙残骸密约之塔', '武装圣域放浪神古神殿',
  '邪念妖地无限城古堡',
  // 迷宫挑战（苍穹之禁城）
  '冰雪废堡暮卫塔', '天山绝顶索姆阿尔灵峰', '邪龙王座龙巢神殿',
  '圣教中枢伊修加德教皇厅', '学识宝库迦巴勒幻想图书馆', '血战苍穹魔科学研究所',
  '空中神域不获岛', '博物战舰无限回廊', '草木庭园圣茉夏娜植物园',
  '地脉灵灯天狼星灯塔', '星海空间颠倒塔', '神圣遗迹无限城市街古迹',
  '天龙宫殿忆罪宫', '黑涡传说破舰岛', '险峻峡谷塞尔法特尔溪谷',
  '秘本宝库迦巴勒幻想图书馆', '坚牢铁壁巴埃萨长城', '天山深境索姆阿尔灵峰',
  // 迷宫挑战（红莲之狂潮）
  '漂流海域妖歌海', '海底宫殿紫水宫', '试炼行路巴儿达木霸道',
  '解放决战多玛王城', '巨炮要塞帝国白山堡', '鏖战红莲阿拉米格',
  '恶党孤城黄金阁', '修行古刹星导寺', '沉没神殿斯卡拉遗迹',
  '红玉火山狱之盖', '疯狂战舰无限回廊', '风水灵庙岩燕庙',
  '死亡大地终末焦土', '污染庭园圣茉夏娜植物园', '国境防线基姆利特暗区',
  // 迷宫挑战（暗影之逆焰）
  '遇袭集落水滩村', '水妖幻园多恩美格禁园', '文明古迹奇坦那神影洞',
  '避暑离宫马利卡大井', '伪造天界格鲁格火山', '末日暗影亚马乌罗提',
  '异界遗构希尔科斯孪晶塔', '创造机构阿尼德罗学院', '魔法宫殿宇宙宫',
  '黑风海底阿尼德罗追忆馆', '暗影决战诺弗兰特', '魔术工房玛托雅工作室',
  '黄金平原帕戈尔赞草原',
  // 迷宫挑战（晓月之终途）
  '异形楼阁佐特塔', '魔导神门巴别塔', '末日树海万相森国',
  '创造环境极北造物院', '星海深幽寻因星晶镜', '最终幻想末世终迹',
  '乐园都市笑笑镇', '电脑梦境斯提格玛四', '近东秘宝阿尔扎达尔海底遗迹群',
  '异界孤城特罗亚宫廷',
  // 迷宫挑战（金曦之遗辉）
  '丛林竞流生息河岸', '通天绝壁沃刻佐莫山', '神圣禁地深空天坑',
  '前哨基地先锋营', '魂魄工厂创生设施', '忆中金曦亚历山德里亚',
  '荒野秘境仙人刺谷', '噩梦乐园迷途鬼区', '废弃据点玉韦亚瓦塔实验站',
  '王城古迹永护塔底', '永久幽界中央终端', '遗忘行路雾之迹',
  '军工要地克吕提俄斯魔导工厂',
  // 讨伐歼灭战（重生之境）
  '伊弗利特讨伐战', '泰坦讨伐战', '迦楼罗讨伐战',
  '究极神兵破坏作战', '那布里亚勒斯讨伐战', '死化奇美拉讨伐战',
  '海德拉讨伐战', '大桥上的决斗', '艾玛吉娜杯斗技大会决赛', '无限城的死斗',
  '伊弗利特歼灭战', '迦楼罗歼灭战', '泰坦歼灭战', '莫古力贤王歼灭战',
  '利维亚桑歼灭战', '拉姆歼灭战', '希瓦歼灭战', '奥丁歼灭战',
  // 讨伐歼灭战：高难度（重生之境）
  '究极神兵假想作战', '迦楼罗歼殛战', '泰坦歼殛战', '伊弗利特歼殛战',
  '莫古力贤王歼殛战', '利维亚桑歼殛战', '拉姆歼殛战', '希瓦歼殛战',
  // 讨伐歼灭战（苍穹之禁城）
  '罗波那歼灭战', '俾斯麦歼灭战', '圆桌骑士歼灭战', '尼德霍格征龙战',
  '萨菲洛特歼灭战', '索菲娅歼灭战', '祖尔宛歼灭战',
  // 讨伐歼灭战：高难度（苍穹之禁城）
  '俾斯麦歼殛战', '罗波那歼殛战', '圆桌骑士幻想歼灭战', '尼德霍格传奇征龙战',
  '萨菲洛特歼殛战', '索菲娅歼殛战', '祖尔宛歼殛战',
  // 讨伐歼灭战（红莲之狂潮）
  '须佐之男歼灭战', '吉祥天女歼灭战', '神龙歼灭战', '月读歼灭战',
  '保镖歼灭战', '火龙狩猎战', '白虎镇魂战', '朱雀镇魂战', '青龙镇魂战',
  // 讨伐歼灭战：高难度（红莲之狂潮）
  '须佐之男歼殛战', '吉祥天女歼殛战', '神龙梦幻歼灭战', '月读幽夜歼灭战',
  '火龙上位狩猎战', '白虎诗魂战', '朱雀诗魂战', '青龙诗魂战',
  // 讨伐歼灭战（暗影之逆焰）
  '缇坦妮雅歼灭战', '无瑕灵君歼灭战', '哈迪斯歼灭战', '红宝石神兵破坏作战',
  '光之战士歼灭战', '绿宝石神兵破坏作战', '钻石神兵捕获作战',
  // 讨伐歼灭战：高难度（暗影之逆焰）
  '缇坦妮雅歼殛战', '无瑕灵君歼殛战', '哈迪斯孤念歼灭战', '红宝石神兵狂想作战',
  '博兹雅堡垒追忆战', '光之战士幻耀歼灭战', '绿宝石神兵狂想作战', '钻石神兵狂想作战',
  // 讨伐歼灭战（晓月之终途）
  '佐迪亚克歼灭战', '海德林歼灭战', '终结之战',
  '巴尔巴莉希娅歼灭战', '卢比坎特歼灭战', '高贝扎歼灭战',
  '泽罗姆斯歼灭战', '阿修罗歼灭战',
  // 讨伐歼灭战：高难度（晓月之终途）
  '佐迪亚克暝暗歼灭战', '海德林晖光歼灭战', '终极之战',
  '巴尔巴莉希娅歼殛战', '卢比坎特歼殛战', '高贝扎歼殛战', '泽罗姆斯歼殛战',
  // 讨伐歼灭战（金曦之遗辉）
  '艳翼蛇鸟歼灭战', '佐拉加歼灭战', '永恒女王歼灭战', '泽莲尼娅歼灭战',
  '永远之暗歼灭战', '护锁刃龙狩猎战', '格莱杨拉波尔歼灭战', '恩欧歼灭战',
  // 讨伐歼灭战：高难度（金曦之遗辉）
  '艳翼蛇鸟歼殛战', '佐拉加歼殛战', '永恒女王忆想歼灭战', '泽莲尼娅歼殛战',
  '永远之暗悲惶歼灭战', '护锁刃龙上位狩猎战', '格莱杨拉波尔歼殛战', '恩欧歼殛战',
  // 团队任务
  '水晶塔 古代人迷宫', '水晶塔 希尔科斯塔', '水晶塔 暗之世界',
  '魔航船虚无方舟', '禁忌城邦玛哈', '影之国',
  '失落之都拉巴纳斯塔', '封闭圣塔黎铎拉纳大灯塔', '乐欲之所瓯博讷修道院',
  '复制工厂废墟', '人偶军事基地', '希望之炮台："塔"',
  '灿烂神域阿格莱亚', '喜悦神域欧芙洛绪涅', '荣华神域塔利亚',
  '朱诺：第一巡行', '桑多利亚：第二巡行', '温达斯：第三巡行',
  // 大型任务（苍穹之禁城）
  '亚历山大机神城 启动之章', '亚历山大机神城 律动之章', '亚历山大机神城 天动之章',
  '亚历山大零式机神城 启动之章', '亚历山大零式机神城 律动之章', '亚历山大零式机神城 天动之章',
  // 大型任务（红莲之狂潮）
  '欧米茄时空狭缝 德尔塔幻境', '欧米茄时空狭缝 西格玛幻境', '欧米茄时空狭缝 阿尔法幻境',
  '欧米茄零式时空狭缝 德尔塔幻境', '欧米茄零式时空狭缝 西格玛幻境', '欧米茄零式时空狭缝 阿尔法幻境',
  // 大型任务（暗影之逆焰）
  '伊甸希望乐园 觉醒之章', '伊甸希望乐园 共鸣之章', '伊甸希望乐园 再生之章',
  '伊甸零式希望乐园 觉醒之章', '伊甸零式希望乐园 共鸣之章', '伊甸零式希望乐园 再生之章',
  // 大型任务（晓月之终途）
  '万魔殿 边境之狱', '万魔殿 炼净之狱', '万魔殿 荒天之狱',
  '零式万魔殿 边境之狱', '零式万魔殿 炼净之狱', '零式万魔殿 荒天之狱',
  // 大型任务（金曦之遗辉）
  '阿卡狄亚登天斗技场 轻量级', '阿卡狄亚登天斗技场 中量级', '阿卡狄亚登天斗技场 重量级',
  '阿卡狄亚零式登天斗技场 轻量级', '阿卡狄亚零式登天斗技场 中量级', '阿卡狄亚零式登天斗技场 重量级',
  // 绝境战 & 诛灭战
  '巴哈姆特绝境战', '究极神兵绝境战', '亚历山大绝境战',
  '幻想龙诗绝境战', '欧米茄绝境验证战', '光暗未来绝境战', '妖星乱舞绝境战',
  '暗黑之云诛灭战',
  // 深层迷宫
  '死者宫殿', '天之御柱', '正统优雷卡', '朝圣交错路',
  '卓异的悲寂歼灭战', '卓异的悲寂深想战',
  // 禁地优雷卡
  '禁地优雷卡 常风之地', '禁地优雷卡 恒冰之地',
  '禁地优雷卡 涌火之地', '禁地优雷卡 丰水之地',
  // 天佑女王
  '南方博兹雅战线', '女王古殿', '零式女王古殿', '扎杜诺尔高原',
  // 蜃景幻界 & 多变/异式迷宫
  '蜃景幻界新月岛 南征之章',
  '多变迷宫 希拉狄哈水道', '多变迷宫 六根山', '多变迷宫 阿罗阿罗岛', '多变迷宫 商客奇谭',
  '异闻希拉狄哈水道', '零式异闻希拉狄哈水道',
  '异闻六根山', '零式异闻六根山',
  '异闻阿罗阿罗岛', '零式异闻阿罗阿罗岛',
  '深读商客奇谭', '异闻商客奇谭',
]

const LEVELS = [
  { label: '大吉', color: '#FFD700', w: 1 },
  { label: '吉',   color: '#81C784', w: 3 },
  { label: '中吉', color: '#4FC3F7', w: 3 },
  { label: '小吉', color: '#CE93D8', w: 3 },
  { label: '末吉', color: '#FFB74D', w: 2 },
  { label: '凶',   color: '#EF5350', w: 1 },
]

const TEXTS = {
  '大吉': [
    '以太结晶共鸣强烈，诸事皆宜。今日挑战高难度副本，必能收获装备。',
    '命星高照，光之战士的力量今日达到顶峰。组队开荒，过本率极高。',
    '星盘呈大吉之象，幸运与你同行。无论战斗还是休闲，皆可全力以赴。',
  ],
  '吉': [
    '以太流动顺畅，队友配合和谐。适合约上好友共同攻略副本，其乐融融。',
    '光之战士气场强盛，今日冒险顺利。挑战稍有难度的内容，胜算颇高。',
    '星象呈吉，行事宜积极。今日与同伴并肩作战，必能留下美好回忆。',
  ],
  '中吉': [
    '迷宫之神微微点头，以太流动平稳。稳健行事，细心操作可弥补运气不足。',
    '命运的天平倾向光明，发挥稳定即可收获不错的成果。不宜急功近利。',
    '星命平稳，今日适合规律地完成日常任务，积少成多，稳步前行。',
  ],
  '小吉': [
    '命星若隐若现，小有收获，享受过程比追求结果更重要。',
    '以太波动轻微，适合轻松的游玩内容，不宜强行挑战高难度副本。',
    '今日运势平平中带一丝惊喜，保持平常心，意外的好事或许悄然而至。',
  ],
  '末吉': [
    '命星偏低，低调行事为佳。避免冲动消费，量力而为。',
    '以太略显浑浊，今日挑战不顺宜及时收手，留得青山在，不愁没柴烧。',
    '星象提示谨慎，减少不必要的风险。整理仓库或陪友人闲逛或许更惬意。',
  ],
  '凶': [
    '今日星象不佳，小心网络波动与心电图。备份好游戏设置，提前储备回复药。',
    '命星隐于云翳，诸事多磨。凶中有转机——挺过难关或有意外惊喜等候。',
    '以太共鸣失调，行事宜三思而后行。建议游玩低难度内容，切勿仓促开荒。',
  ],
}

const ACTIVITIES = [
  '挑战高难副本', '精心制作装备', '采集珍稀材料',
  '漫步金碟嘉年华', '组队讨伐极神', '探索未知地图',
  '完成主线剧情', 'PvP争锋称雄', '悠然垂钓修心',
  '精心装修雅居', '收集成就勋章', '挑战零式炒股',
  '完成每周常规', '约好友一起玩', '解锁新职业技能',
  '刷取幻化收藏', '参加限时活动', '收集九宫幻卡',
]

// ── Logic ────────────────────────────────────────────────────────────────────

const REVEALED_KEY   = 'ff14navi-fortune-revealed'
const USER_TOKEN_KEY = 'ff14navi-fortune-token'

function getUserToken() {
  let token = localStorage.getItem(USER_TOKEN_KEY)
  if (!token) {
    token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    localStorage.setItem(USER_TOKEN_KEY, token)
  }
  return token
}

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function loadRevealed() {
  try {
    const raw = localStorage.getItem(REVEALED_KEY)
    if (!raw) return false
    const { date } = JSON.parse(raw)
    return date === getTodayStr()
  } catch { return false }
}

function saveRevealed() {
  localStorage.setItem(REVEALED_KEY, JSON.stringify({ date: getTodayStr() }))
}

function buildFortune() {
  const dateStr = getTodayStr()
  const token   = getUserToken()
  const rand    = mulberry32(hashStr(dateStr + token))

  const level    = pickWeighted(rand, LEVELS)
  const job      = pick(rand, JOBS)
  const dungeon  = pick(rand, DUNGEONS)
  const activity = pick(rand, ACTIVITIES)
  const texts    = TEXTS[level.label]
  const text     = pick(rand, texts)
  const luckyNum = Math.floor(rand() * 10)

  return { dateStr, level, job, dungeon, activity, text, luckyNum }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function DailyFortune({ noWrap = false }) {
  const [revealed, setRevealed] = useState(loadRevealed)
  const fortune = useMemo(() => buildFortune(), [])
  const { effective } = useTheme()

  function handleReveal() {
    setRevealed(true)
    saveRevealed()
  }

  const adapt = c => effective === 'light' ? adaptForLight(c) : c
  const accent = adapt(fortune.level.color)

  const content = (
    <div
      className="rounded-2xl overflow-hidden h-full flex flex-col"
      style={{
        background: 'var(--md-surface-container)',
        border: `1px solid ${accent}55`,
        position: 'relative',
      }}
    >

      {/* Header bar */}
      <div
        className="relative flex items-center justify-between px-5 py-2.5"
        style={{ borderBottom: `1px solid ${accent}30` }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--md-primary)', opacity: 0.7, fontSize: '0.75rem' }}>✦</span>
          <span className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--md-on-surface-variant)', letterSpacing: '0.15em' }}>
            每日运势
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--md-outline)', opacity: 0.6 }}>
          {fortune.dateStr}
        </span>
      </div>

      {!revealed ? (
        /* ── Unrevealed state ── */
        <button
          className="relative flex-1 w-full flex flex-col items-center justify-center gap-3 px-5"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          onClick={handleReveal}
        >
          <div style={{ fontSize: '2.4rem', lineHeight: 1 }}>🔮</div>
          <div className="text-sm font-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
            点击占卜今日运势
          </div>
        </button>
      ) : (
        /* ── Revealed state ── */
        <div className="relative flex flex-col flex-1">

          {/* Main body — fortune level + text */}
          <div className="flex gap-0 flex-1">

            {/* Fortune level column */}
            <div
              className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-5 py-4"
              style={{ borderRight: `1px solid ${accent}22`, minWidth: '5.5rem' }}
            >
              <div
                className="font-black leading-none"
                style={{
                  fontSize: '2.8rem',
                  color: accent,
                  textShadow: `0 0 32px ${accent}60`,
                  fontFamily: '"Noto Serif SC", serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {fortune.level.label}
              </div>
              <div className="text-xs font-medium tracking-widest" style={{ color: accent, opacity: 0.55 }}>
                今日运势
              </div>
            </div>

            {/* Fortune text column */}
            <div className="flex-1 min-w-0 flex items-center px-5 py-4">
              <p
                className="leading-loose"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--md-on-surface)',
                  opacity: 0.88,
                  letterSpacing: '0.02em',
                }}
              >
                {fortune.text}
              </p>
            </div>
          </div>

          {/* Footer metadata bar */}
          <div
            className="grid grid-cols-4"
            style={{ borderTop: `1px solid ${accent}20`, background: `${accent}08` }}
          >
            {[
              { label: '幸运职业', value: fortune.job.name, sub: ROLE_LABEL[fortune.job.role], color: adapt(fortune.job.color) },
              { label: '幸运副本', value: fortune.dungeon, color: accent },
              { label: '今日宜',   value: fortune.activity, color: 'var(--md-on-surface-variant)' },
              { label: '幸运数字', value: String(fortune.luckyNum), color: accent, mono: true },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-0.5 py-2.5 px-2"
                style={{ borderRight: i < 3 ? `1px solid ${accent}15` : 'none' }}
              >
                <div className="text-xs" style={{ color: 'var(--md-outline)', opacity: 0.55, fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                  {item.label}
                </div>
                <div
                  className="font-semibold leading-tight text-center"
                  style={{
                    fontSize: '0.75rem',
                    color: item.color,
                    fontFamily: item.mono ? 'ui-monospace, "Cascadia Code", monospace' : undefined,
                  }}
                >
                  {item.value}
                  {item.sub && (
                    <span style={{ opacity: 0.55, fontSize: '0.6rem', marginLeft: '0.2rem' }}>
                      {item.sub}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )

  if (noWrap) return content
  return <div className="max-w-7xl mx-auto px-4 mb-6">{content}</div>
}
