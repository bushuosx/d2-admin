import parent from '../index'
const BaseURL = parent.BaseURL + '/ryzg'

function reject (msg) {
  return Promise.reject(new Error('RYZGApi：' + msg))
}

export default {
  BaseURL,
  create ({ zylbId, zgsj, zgzsbm, fileIdList }) {
    if (!zylbId || !zgsj || !zgzsbm || !Array.isArray(fileIdList)) {
      return reject('create参数无效')
    }
    return parent.axios.post(BaseURL, { zylbId, zgsj, zgzsbm, fileIdList })
  },
  update ({ id, zcLevel, zylbId, zgsj, zgzsbm, fileIdList }) {
    if (!id || !zcLevel || !zylbId || !zgsj || !zgzsbm || !Array.isArray(fileIdList)) {
      return reject('update参数无效')
    }
    return parent.axios.put(BaseURL, { id, zcLevel, zylbId, zgsj, zgzsbm, fileIdList })
  },
  get (ryzgid) {
    if (!ryzgid) {
      return reject('ryzgid不能为空')
    }
    return parent.axios.get(BaseURL + '/' + ryzgid)
  },
  getbyprofile (profileid) {
    if (!profileid) {
      return reject('profileid不能为空')
    }
    return parent.axios.get(BaseURL + '/getbyprofile/' + profileid)
  },
  approvekjsh (id, reason) {
    if (!id) {
      return reject('ryzgid不能为空')
    }
    return parent.axios.put(BaseURL + '/approvekjsh', { id, reason })
  },
  rejectkjsh (id, reason) {
    if (!id) {
      return reject('ryzgid不能为空')
    }
    return parent.axios.put(BaseURL + '/rejectkjsh', { id, reason })
  },
  commit (ryzgid) {
    if (!ryzgid) {
      return reject('ryzgid不能为空')
    }
    return parent.axios.patch(BaseURL + '/commit/' + ryzgid)
  },
  reedit (ryzgid) {
    if (!ryzgid) {
      return reject('ryzgid不能为空')
    }
    return parent.axios.patch(BaseURL + '/reedit/' + ryzgid)
  }
}
