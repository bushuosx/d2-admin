import parent from '../index'

const BaseURL = parent.BaseURL + '/ry'

function reject (msg) {
  return Promise.reject(new Error('RYApi：' + msg))
}

export default {
  BaseURL,
  getbyname (name, pageIndex) {
    if (!name) {
      return reject('要查询的用户名不能为空！')
    }
    let url = this.BaseURL + '/getbyname/' + name
    if (pageIndex) {
      if (pageIndex < 1) {
        return reject('pageIndex不能小于1')
      }
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  },
  getemployees (name, pageIndex) {
    if (!name) {
      return reject('要查询的用户名不能为空！')
    }
    let url = this.BaseURL + '/getemployees/' + name
    if (pageIndex) {
      if (pageIndex < 1) {
        return reject('pageIndex不能小于1')
      }
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  },
  getbyid (ryid) {
    if (ryid === null || ryid === undefined || ryid === '') {
      return reject('ryid不能为空！')
    }
    return parent.axios.get(BaseURL + '/' + ryid)
  },
  getbygh (rygh) {
    if (rygh === null || rygh === undefined || rygh === '') {
      return reject('ryid不能为空！')
    }
    return parent.axios.get(BaseURL + '/getbygh/' + rygh)
  },
  refreshMe () {
    return parent.axios.get(BaseURL + '/refreshme')
  },
  setksmanager (data) {
    if (!Array.isArray(data) || data.length === 0) {
      return reject('data不能为空')
    }
    return parent.axios.post(BaseURL + '/setksmanager', data)
  },
  importEmployees (data) {
    if (!Array.isArray(data) || data.length === 0) {
      return reject('data不能为空')
    }
    return parent.axios.post(BaseURL + '/importemployees', data, { timeout: 40000 })
  }
}
