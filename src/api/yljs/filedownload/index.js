import axios from '@/plugin/axios'
const BaseURL = 'http://localhost:5002/file/yljs/'

const reject = function (errmsg) {
  return Promise.reject(new Error('FileDownload:' + errmsg))
}

export default {
  getFile (area, fileid) {
    if (!area) {
      return reject('area不能为空')
    }
    if (!fileid) {
      return reject('reject不能为空')
    }

    return axios.get(BaseURL + area + '/' + fileid)
  }
}
