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
  update ({ id, zylbId, zgsj, zgzsbm, fileIdList }) {
    debugger
    if (!id || !zylbId || !zgsj || !zgzsbm || !Array.isArray(fileIdList)) {
      return reject('update参数无效')
    }
    return parent.axios.put(BaseURL, { id, zylbId, zgsj, zgzsbm, fileIdList })
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
  approvekjsh (ksid, id, reason) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    if (!id) {
      return reject('ryzgid不能为空')
    }
    return parent.axios.put(BaseURL + '/approvekjsh/' + ksid, { id, reason })
  },
  rejectkjsh (ksid, id, reason) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    if (!id) {
      return reject('ryzgid不能为空')
    }
    return parent.axios.put(BaseURL + '/rejectkjsh/' + ksid, { id, reason })
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
  },
  delete (id) {
    if (!id) {
      return reject('id不能为空')
    }
    return parent.axios.post(BaseURL + '/delete/' + id)
  }
}
