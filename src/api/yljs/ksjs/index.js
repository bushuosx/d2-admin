import parent from '../index'

const BaseURL = parent.BaseURL + '/ksjs'

function reject (msg) {
  return Promise.reject(new Error('KSJSApi：' + msg))
}

export default {
  BaseURL,
  getbynameforcreate (ksid, name) {
    if (!ksid) {
      reject('ksid不能为空')
    }

    if (!name) {
      return reject('名称关键字不能为空')
    }
    let url = this.BaseURL + '/getbynameforcreate/' + ksid + '/' + name

    return parent.axios.get(url)
  },
  getksjslist (ksid) {
    if (!ksid) {
      reject('ksid不能为空')
    }
    let url = this.BaseURL + '/getksjslist/' + ksid
    return parent.axios.get(url)
  },
  createksjs (ksid, JSIDList) {
    if (!ksid) {
      reject('ksid不能为空')
    }

    if (!Array.isArray(JSIDList) || JSIDList.length === 0) {
      return reject('技术列表不能为空')
    }
    let url = this.BaseURL + '/createksjs/' + ksid
    return parent.axios.post(url, { JSIDList })
  },
  deleteksjs (ksid, JSIDList) {
    if (!ksid) {
      reject('ksid不能为空')
    }

    if (!Array.isArray(JSIDList) || JSIDList.length === 0) {
      return reject('技术列表不能为空')
    }
    let url = this.BaseURL + '/deleteksjs/' + ksid
    return parent.axios.post(url, { JSIDList })
  },
  getbynameforusercreate (ksid, name) {
    if (!ksid) {
      reject('ksid不能为空')
    }

    let url = this.BaseURL + '/getbynameforusercreate/' + ksid
    if (name !== null && name !== undefined) {
      url += '/' + name
    }

    return parent.axios.get(url)
  }
}
