/*
 * 该文件是运行在 Node.js 端的，获取数据的基本的思路就是后端代理，即提供接口路由供前端页面使用，然后在路由内部，我们接收到前端请求后，再发送 HTTP 请求到第三方服务接口，携带相应的请求参数，包括签名的参数字段等等。
 * 对于从第三方接口返回的数据，我们会做一层数据处理，最终提供给前端的数据前端可以直接使用，无需再处理。这样也比较符合真实企业项目的开发规范，即数据的处理放在后端做，前端只做数据渲染和交互。
 */
const axios = require('axios')
const pinyin = require('pinyin')
const Base64 = require('js-base64').Base64
// 获取签名方法
const getSecuritySign = require('./sign')

const ERR_OK = 0
const token = 5381

// 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl = 'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'

// 公共参数
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  needNewCode: 0,
  format: 'json',
  platform: 'yqq.json'
}

// 获取一个随机数值
function getRandomVal(prefix = '') {
  return prefix + (Math.random() + '').replace('0.', '')
}

// 获取一个随机 uid
function getUid() {
  const t = (new Date()).getUTCMilliseconds()
  return '' + Math.round(2147483647 * Math.random()) * t % 1e10
}

const baseURL = 'http://ustbhuangyi.com/music-next';
// 对 axios get 请求的封装
// 修改请求的 headers 值，合并公共请求参数
function get(url, params) {
  url = `${baseURL}${url}`;
  return axios.get(url, {
    headers: {
      'X-XSRF-TOKEN': '5tYJ6E6M-A-ljpR7bhLlDrxzS-PW1rXa1_Kk',
      referer: 'http://ustbhuangyi.com/music-next/',
      host: 'ustbhuangyi.com',
      'Cookie': '_csrf=lgKzRPjs-AM3nqcYczLxVOqH; XSRF-TOKEN=5tYJ6E6M-A-ljpR7bhLlDrxzS-PW1rXa1_Kk'
    },
    params: Object.assign({}, commonParams, params)
  })
}

// 对 axios post 请求的封装
// 修改请求的 headers 值
function post(url, params) {
  return axios.post(url, params, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 处理歌曲列表
function handleSongList(list) {
  const songList = []

  list.forEach((item) => {
    const info = item.songInfo || item
    if (info.pay.pay_play !== 0 || !info.interval) {
      // 过滤付费歌曲和获取不到时长的歌曲
      return
    }

    // 构造歌曲的数据结构
    const song = {
      id: info.id,
      mid: info.mid,
      name: info.name,
      singer: mergeSinger(info.singer),
      url: '', // 在另一个接口获取
      duration: info.interval,
      pic: info.album.mid ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${info.album.mid}.jpg?max_age=2592000` : fallbackPicUrl,
      album: info.album.name
    }

    songList.push(song)
  })

  return songList
}

// 合并多个歌手的姓名
function mergeSinger(singer) {
  const ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

// 注册后端路由
function registerRouter(app) {
  registerRecommend(app)

  registerSingerList(app)

  registerSingerDetail(app)

  registerSongsUrl(app)

  registerLyric(app)

  registerAlbum(app)

  registerTopList(app)

  registerTopDetail(app)

  registerHotKeys(app)

  registerSearch(app)
}

// 注册推荐列表接口路由
function registerRecommend(app) {
  const url = '/api/getRecommend'
  app.get(url, (req, res) => {
    // 发送 get 请求
    get(url, req.query).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.json(data)
      } else {
        res.json(data)
      }
    })
  })
}

// 注册歌手列表接口路由
function registerSingerList(app) {
  const url = '/api/getSingerList'
  app.get(url, (req, res) => {
    // 发送 get 请求
    get(url, req.query).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.json(data)
      } else {
        res.json(data)
      }
    })
  })
}

// 注册歌手详情接口路由
function registerSingerDetail(app) {
  const url = '/api/getSingerDetail'
  app.get(url, (req, res) => {
    // 发送 get 请求
    get(url, req.query).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.json(data)
      } else {
        res.json(data)
      }
    })
  })
}

// 注册歌曲 url 获取接口路由
// 因为歌曲的 url 每天都在变化，所以需要单独的接口根据歌曲的 mid 获取
function registerSongsUrl(app) {
  const url = '/api/getSongsUrl'
  app.get(url, (req, res) => {
    // 发送 get 请求
    get(url, req.query).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.json(data)
      } else {
        res.json(data)
      }
    })
  })
}

// 注册歌词接口
function registerLyric(app) {
  const url = '/api/getLyric'
  app.get(url, (req, res) => {
    // 发送 get 请求
    get(url, req.query).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.json(data)
      } else {
        res.json(data)
      }
    })
  })
}

// 注册歌单专辑接口
function registerAlbum(app) {
  const url = '/api/getAlbum'
  app.get(url, (req, res) => {
    // 发送 get 请
    get(url, req.query).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.json(data)
      } else {
        res.json(data)
      }
    })
  })
}

// 注册排行榜接口
function registerTopList(app) {
  const url = '/api/getTopList'
  app.get(url, (req, res) => {
    // 发送 get 请求
    get(url, req.query).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.json(data)
      } else {
        res.json(data)
      }
    })
  })
}

// 注册排行榜详情接口
function registerTopDetail(app) {
  const url = '/api/getTopDetail'
  app.get(url, (req, res) => {
    // 发送 get 请求
    get(url, req.query).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.json(data)
      } else {
        res.json(data)
      }
    })
  })
}

// 注册热门搜索接口
function registerHotKeys(app) {
  const url = '/api/getHotKeys'
  app.get(url, (req, res) => {
    // 发送 get 请求
    get(url, req.query).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.json(data)
      } else {
        res.json(data)
      }
    })
  })
}

// 注册搜索查询接口
function registerSearch(app) {
  const url = '/api/search'
  app.get(url, (req, res) => {
    // 发送 get 请求
    get(url, req.query).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        res.json(data)
      } else {
        res.json(data)
      }
    })
  })
}

module.exports = registerRouter
