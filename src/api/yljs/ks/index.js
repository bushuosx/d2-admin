import parent from '../index'
const BaseURL = parent.BaseURL + '/ks'

function reject (msg) {
  return Promise.reject(new Error('KSApi：' + msg))
}

export default {
  BaseURL,
  getksbyname () {

  },
  getallks () {
    return parent.axios.get(BaseURL + '/getallks')
    // if (parent.debug) {
    //   return parent.resolve([{ id: 'ad1169', bm: '1169', mc: '呼吸2' }, { id: 'ad1170', bm: '1170', mc: '呼吸3' }])
    // } else {
    // }
  },
  loadksry (ksid) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    return parent.axios.get(BaseURL + '/loadksry/' + ksid)
  },
  importks (ksList) {
    if (!Array.isArray(ksList)) {
      return reject('ksList必须为数组')
    }
    return parent.axios.post(BaseURL + '/postlist', ksList, { timeout: 20000 })
  }
}
