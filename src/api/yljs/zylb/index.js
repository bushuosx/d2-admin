import parent from '../index'
const BaseURL = parent.BaseURL + '/zylb'

function reject (msg) {
  return Promise.reject(new Error('ZYLBApi：' + msg))
}

export default {
  BaseURL,
  getall () {
    return parent.axios.get(BaseURL + '/getall')
  },
  getbymc (mc) {
    if (!mc) {
      reject('mc不能为空')
    }
    return parent.axios.get(BaseURL + '/getbymc/' + mc)
  }
}
