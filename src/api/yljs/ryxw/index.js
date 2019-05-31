import parent from '../index'
const BaseURL = parent.BaseURL + '/ryxw'

function reject (msg) {
  return Promise.reject(new Error('RYXWApi：' + msg))
}

export default {
  BaseURL,
  create ({ xw, xwsj, xwbm, fileIdList }) {
    if (!xw || !xwsj || !xwbm || !Array.isArray(fileIdList)) {
      return reject('create参数无效')
    }
    return parent.axios.post(BaseURL, { xw, xwsj, xwbm, fileIdList })
  },
  update ({ id, xw, xwsj, xwbm, fileIdList }) {
    if (!id || !xw || !xwsj || !xwbm || !Array.isArray(fileIdList)) {
      return reject('update参数无效')
    }
    return parent.axios.put(BaseURL, { id, xw, xwsj, xwbm, fileIdList })
  },
  get (ryxwid) {
    if (!ryxwid) {
      return reject('ryxwid不能为空')
    }
    return parent.axios.get(BaseURL + '/' + ryxwid)
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
      return reject('ryxwid不能为空')
    }
    return parent.axios.put(BaseURL + '/approvekjsh/' + ksid, { id, reason })
  },
  rejectkjsh (ksid, id, reason) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    if (!id) {
      return reject('ryxwid不能为空')
    }
    return parent.axios.put(BaseURL + '/rejectkjsh/' + ksid, { id, reason })
  },
  commit (ryxwid) {
    if (!ryxwid) {
      return reject('ryxwid不能为空')
    }
    return parent.axios.patch(BaseURL + '/commit/' + ryxwid)
  },
  reedit (ryxwid) {
    if (!ryxwid) {
      return reject('ryxwid不能为空')
    }
    return parent.axios.patch(BaseURL + '/reedit/' + ryxwid)
  },
  delete (id) {
    if (!id) {
      return reject('id不能为空')
    }
    return parent.axios.post(BaseURL + '/delete/' + id)
  }
}
