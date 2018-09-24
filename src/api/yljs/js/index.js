import parent from '../index'
const BaseURL = parent.BaseURL + '/js'

function reject (msg) {
  return Promise.reject(new Error('JSApi：' + msg))
}

export default {
  BaseURL,
  getbyname (name, pageIndex = 1) {
    if (!name || name === undefined) {
      return reject('要查询的技术名称不能为空！')
    }
    let url = this.BaseURL + '/getbyname/' + name
    if (pageIndex !== null && pageIndex !== undefined) {
      if (pageIndex < 1) {
        return reject('pageIndex不能小于1')
      }
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  },
  getbycode (code, pageIndex = 1) {
    if (!code || code === undefined) {
      return reject('要查询的技术编码不能为空！')
    }
    let url = this.BaseURL + '/getbycode/' + code
    if (pageIndex !== null && pageIndex !== undefined) {
      if (pageIndex < 1) {
        return reject('pageIndex不能小于1')
      }
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  }
}
