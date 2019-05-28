import parent from '../index'
const BaseURL = parent.BaseURL + '/ryzc'

function reject (msg) {
  return Promise.reject(new Error('RYZCApi：' + msg))
}

export default {
  BaseURL,
  create ({ zcLevel, zylbId, zcsj, zcbm, fileIdList }) {
    if (!zcLevel || !zylbId || !zcsj || !zcbm || !Array.isArray(fileIdList)) {
      return reject('create参数无效')
    }
    return parent.axios.post(BaseURL, { zcLevel, zylbId, zcsj, zcbm, fileIdList })
  },
  update ({ id, zcLevel, zylbId, zcsj, zcbm, fileIdList }) {
    if (!id || !zcLevel || !zylbId || !zcsj || !zcbm || !Array.isArray(fileIdList)) {
      return reject('update参数无效')
    }
    return parent.axios.put(BaseURL, { id, zcLevel, zylbId, zcsj, zcbm, fileIdList })
  },
  get (ryzcid) {
    if (!ryzcid) {
      return reject('ryzcid不能为空')
    }
    return parent.axios.get(BaseURL + '/' + ryzcid)
  },
  getbyprofile (profileid) {
    if (!profileid) {
      return reject('profileid不能为空')
    }
    return parent.axios.get(BaseURL + '/getbyprofile/' + profileid)
  },
  approvekjsh (id, reason) {
    if (!id) {
      return reject('ryzcid不能为空')
    }
    return parent.axios.put(BaseURL + '/approvekjsh', { id, reason })
  },
  rejectkjsh (id, reason) {
    if (!id) {
      return reject('ryzcid不能为空')
    }
    return parent.axios.put(BaseURL + '/rejectkjsh', { id, reason })
  },
  commit (ryzcid) {
    if (!ryzcid) {
      return reject('ryzcid不能为空')
    }
    return parent.axios.patch(BaseURL + '/commit/' + ryzcid)
  },
  reedit (ryzcid) {
    if (!ryzcid) {
      return reject('ryzcid不能为空')
    }
    return parent.axios.patch(BaseURL + '/reedit/' + ryzcid)
  },
  delete (id) {
    if (!id) {
      return reject('id不能为空')
    }
    return parent.axios.post(BaseURL + '/delete/' + id)
  }
}
