import parent from '../index'
const BaseURL = parent.BaseURL + '/ryxl'

function reject (msg) {
  return Promise.reject(new Error('RYXLApi：' + msg))
}

export default {
  BaseURL,
  create ({ xl, xlsj, xlbm, fileIdList }) {
    if (!xl || !xlsj || !xlbm || !Array.isArray(fileIdList)) {
      return reject('create参数无效')
    }
    return parent.axios.post(BaseURL, { xl, xlsj, xlbm, fileIdList })
  },
  update ({ id, xl, xlsj, xlbm, fileIdList }) {
    if (!id || !xl || !xlsj || !xlbm || !Array.isArray(fileIdList)) {
      return reject('update参数无效')
    }
    return parent.axios.put(BaseURL, { id, xl, xlsj, xlbm, fileIdList })
  },
  get (ryxlid) {
    if (!ryxlid) {
      return reject('ryxlid不能为空')
    }
    return parent.axios.get(BaseURL + '/' + ryxlid)
  },
  getbyprofile (profileid) {
    if (!profileid) {
      return reject('profileid不能为空')
    }
    return parent.axios.get(BaseURL + '/getbyprofile/' + profileid)
  },
  approvekjsh (id, reason) {
    if (!id) {
      return reject('ryxlid不能为空')
    }
    return parent.axios.put(BaseURL + '/approvekjsh', { id, reason })
  },
  rejectkjsh (id, reason) {
    if (!id) {
      return reject('ryxlid不能为空')
    }
    return parent.axios.put(BaseURL + '/rejectkjsh', { id, reason })
  },
  commit (ryxlid) {
    if (!ryxlid) {
      return reject('ryxlid不能为空')
    }
    return parent.axios.patch(BaseURL + '/commit/' + ryxlid)
  },
  reedit (ryxlid) {
    if (!ryxlid) {
      return reject('ryxlid不能为空')
    }
    return parent.axios.patch(BaseURL + '/reedit/' + ryxlid)
  },
  getksryxl (ksid) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    return parent.axios.get(BaseURL + '/getksryxl/' + ksid)
  },
  delete (id) {
    if (!id) {
      return reject('id不能为空')
    }
    return parent.axios.post(BaseURL + '/delete/' + id)
  }
}
