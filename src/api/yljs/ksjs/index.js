import parent from '../index'

import user from '@/libs/util.user.js'

const BaseURL = parent.BaseURL + '/ksjs'

function reject (msg) {
  return Promise.reject(new Error('KSJSApi：' + msg))
}

export default {
  BaseURL,
  getbynameforcreate (name) {
    if (!name) {
      return reject('名称关键字不能为空')
    }
    let url = this.BaseURL + '/getbynameforcreate/' + name

    return parent.axios.get(url)
  },
  getksjslist () {
    let url = this.BaseURL + '/getksjslist'
    return parent.axios.get(url)
  },
  createksjs (JSIDList) {
    if (!user.hasRoles([user.Roles.科室技术创建])) {
      return reject('权限不足')
    }

    if (!Array.isArray(JSIDList) || JSIDList.length === 0) {
      return reject('技术不能为空')
    }
    let url = this.BaseURL + '/createksjs'
    return parent.axios.post(url, { JSIDList })
  },
  getbynameforusercreate (name) {
    if (!name) {
      return reject('名称关键字不能为空')
    }
    let url = this.BaseURL + '/getbynameforusercreate/' + name

    return parent.axios.get(url)
  }
}
