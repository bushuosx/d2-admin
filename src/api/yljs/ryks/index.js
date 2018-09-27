import parent from '../index'
const BaseURL = parent.BaseURL + '/ryks'

function reject (msg) {
  return Promise.reject(new Error('RYKSApi：' + msg))
}

export default {
  BaseURL,
  createryks (ksid, reason) {
    // if (ryid === null || ryid === undefined || ryid === '') {
    //   return reject('ryid不能为空')
    // }
    if (ksid === null || ksid === undefined || ksid === '') {
      return reject('ksid不能为空')
    }
    return parent.axios.post(BaseURL, { ryid: parent.getUserId(), ksid, reason })
  }
}
