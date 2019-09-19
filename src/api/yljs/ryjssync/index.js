import parent from '../index'
const BaseURL = parent.BaseURL + '/ryjssync'

function reject (msg) {
  return Promise.reject(new Error('RYJSSyncApi：' + msg))
}

export default {
  BaseURL,
  getsyncinfo (category) {
    if (!category) {
      return reject('category必须为已定义的数字')
    }
    return parent.axios.get(BaseURL + '/getsyncinfo/' + category)
  },
  updateapproved (max) {
    if (!max) {
      return reject('max必须为已定义的数字')
    }
    return parent.axios.put(BaseURL + '/updateapproved/' + max)
  },
  updatebanned (max) {
    if (!max) {
      return reject('max必须为已定义的数字')
    }
    return parent.axios.put(BaseURL + '/updatebanned/' + max)
  }
}
