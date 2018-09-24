import parent from '../index'

const BaseURL = parent.BaseURL + '/ry'

function reject (msg) {
  return Promise.reject(new Error('RYApi：' + msg))
}

export default {
  BaseURL,
  getbyname (name, pageIndex = 1) {
    if (name === null || name === undefined || name === '') {
      return reject('要查询的用户名不能为空！')
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
  getbyid (ryid) { },
  getbygh (rygh) { }
}
