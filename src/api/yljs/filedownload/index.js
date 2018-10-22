import parent from '../index.js'
const BaseURL = parent.APIServer + '/file/yljs'

const reject = function (errmsg) {
  return Promise.reject(new Error('FileDownload:' + errmsg))
}

export default {
  fileServer: BaseURL,
  getFile (area, fileid) {
    if (!area) {
      return reject('area不能为空')
    }
    if (!fileid) {
      return reject('fileid不能为空')
    }

    return parent.axios.get(BaseURL + '/' + area + '/' + fileid, {
      responseType: 'blob' // 返回数据的格式，可选值为arraybuffer,blob,document,json,text,stream，默认值为json
    })
  }
}
