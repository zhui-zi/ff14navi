import https from 'https'
import http from 'http'

const URLS = [
  "https://ff.web.sdo.com/web8/index.html",
  "https://qu.sdo.com/game/1",
  "https://qu.sdo.com/surround-shop",
  "https://actff1.web.sdo.com/project/141028dgf/index.html",
  "https://ffpay.sdo.com/pc/giftsStation/index.html",
  "https://actff1.web.sdo.com/20180707jifen/index.html",
  "https://weibo.com/cnff14",
  "https://space.bilibili.com/6655514",
  "https://weibo.com/siguakafuka",
  "https://actff1.web.sdo.com/project/20210621ffviolation/index.html",
  "https://actff1.web.sdo.com/20190315Zhaodai/index.html",
  "https://www.daoyu8.com/",
  "https://pay.sdo.com/item/GWPAY-100001900",
  "https://www.wegame.com.cn/mall/list.html",
  "https://www.finalfantasyxiv.com/",
  "https://jp.finalfantasyxiv.com/lodestone/playguide/db/",
  "https://www.youtube.com/user/FINALFANTASYXIV",
  "https://twitter.com/ff_xiv_jp",
  "https://store.finalfantasyxiv.com/ffxivstore/ja-jp/",
  "https://secure.square-enix.com/account/app/svc/ffxivshopacctop",
  "https://forum.square-enix.com/ffxiv/forum.php",
  "https://jp.finalfantasyxiv.com/blog/",
  "https://www.ffxiv.cn/v2/",
  "https://ff14.org/",
  "https://ff14.huijiwiki.com/wiki/",
  "https://garlandtools.cn/",
  "https://ffxiv.gamerescape.com/wiki/Main_Page",
  "https://ffxivmacro.net/",
  "https://eriones.com/",
  "http://ffxiv.es.exdreams.net/",
  "https://bbs.nga.cn/thread.php?fid=-362960",
  "https://tieba.baidu.com/f?kw=ff14",
  "https://weibo.com/u/7185899976",
  "https://www.reddit.com/r/ffxiv/",
  "https://space.bilibili.com/932340/video",
  "https://gearing.ffsusu.com/",
  "https://kupo.world/",
  "https://ff14.org/duty/",
  "https://cn.fflogs.com/",
  "https://xivanalysis.com/",
  "https://ff14.link/",
  "https://bbs.nga.cn/read.php?tid=13014248",
  "https://eureka.ffxivsc.cn/",
  "https://ffxiv-eureka.com/",
  "https://bzy.mocca-works.site/",
  "https://5p.nbbjack.com/",
  "http://ffxiv.tk/crafter/",
  "https://ffxivteamcraft.com/",
  "https://universalis.app/",
  "https://fish.ffmomola.com/",
  "https://cn.ff14angler.com/",
  "https://caiji.ffxiv.cn/",
  "https://next.ffmomola.com/",
  "https://wrd.ffxiv.cn/",
  "http://super-aardvark.github.io/yuryu/",
  "https://docs.qq.com/sheet/DY2lCeEpwemZESm5q",
  "https://arrtripletriad.com/cn/huan-ka-yi-lan",
  "https://weibo.com/Eorzkea",
  "https://cn.ff14housing.com/",
  "https://www.ffxivgardening.com/",
  "https://housingsnap.com/",
  "https://wanahome.ffxiv.bingyin.org/",
  "https://house.ffxiv.cyou/",
  "https://www.ffxivsc.cn/",
  "https://ffxiv.eorzeacollection.com/",
  "https://mirapri.com/",
  "https://gposers.com/gshade/",
  "https://weibo.com/ffxivnge",
  "https://www.ffxivcollection.com/",
  "https://ffxiv.dlunch.net/model",
  "https://www.ffxiv-textools.net/",
  "https://www.xivmodarchive.com/",
  "https://tools.dsrkafuu.net/ffxiv",
  "https://ffxivhuntcn.com/",
  "https://faloop.app/",
  "https://xn--v9x.net/hunt/sonar/",
  "https://tracker.ff14hunttool.com/timer",
  "https://ffxiv.annangela.cn/introduction.html",
  "https://sonar.ff14.cafe/",
  "https://thewakingsands.github.io/blue-mage/",
  "https://bbs.tggfl.com/",
  "http://xn--v9x.net/",
  "https://ffcafe.org/act/",
  "https://tools.ffxiv.cn/lajipai/index.html",
  "https://ff14moomoo.com/",
  "https://mo_n.gitee.io/ffxivchocobo/",
  "http://ffxivsquadron.com/",
  "https://annangela.github.io/FFXIVSightseeingGuide/",
  "https://nephren_ruq.gitee.io/fauxhollowsprobabilisticsolver/",
  "http://ashtender.com/ffxiv/tails",
  "https://github.com/Natsukage/PostNamazu",
  "https://arrstatus.com/",
  "https://asvel.github.io/ffxiv-weather/",
  "https://file.bluefissure.com/FFXIV/",
  "https://www.innocence-vauthry.xyz/",
  "https://strings.wakingsands.com/",
  "https://mystatus.bingyin.org/status/ffxivcn",
]

function checkUrl(rawUrl) {
  return new Promise((resolve) => {
    try {
      const cleanUrl = rawUrl.replace(/#.*$/, '')
      const url = new URL(cleanUrl)
      const mod = url.protocol === 'https:' ? https : http
      const options = {
        hostname: url.hostname,
        port: url.port || undefined,
        path: url.pathname + url.search,
        method: 'HEAD',
        timeout: 9000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      }
      const req = mod.request(options, (res) => {
        resolve({ url: rawUrl, status: res.statusCode })
        res.resume()
      })
      req.on('error', (e) => resolve({ url: rawUrl, error: e.code || e.message }))
      req.on('timeout', () => { req.destroy(); resolve({ url: rawUrl, error: 'TIMEOUT' }) })
      req.end()
    } catch (e) {
      resolve({ url: rawUrl, error: e.message })
    }
  })
}

const results = await Promise.allSettled(URLS.map(checkUrl))
const rows = results.map(r => r.value || r.reason)

const ok   = rows.filter(r => r.status && r.status < 400)
const redir = rows.filter(r => r.status && r.status >= 300 && r.status < 400)
const fail  = rows.filter(r => r.error || (r.status && r.status >= 400))

console.log(`\n✅ OK (${ok.length - redir.length})  🔀 Redirect (${redir.length})  ❌ Fail (${fail.length})\n`)
console.log('=== FAILURES / ERRORS ===')
fail.forEach(r => console.log(`  [${(r.error || r.status).toString().padStart(10)}]  ${r.url}`))
console.log('\n=== REDIRECTS ===')
redir.forEach(r => console.log(`  [${r.status}]  ${r.url}`))
