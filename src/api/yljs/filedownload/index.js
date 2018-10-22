import parent from '../index.js'
import myaxios from './myaxios.js'
const BaseURL = parent.APIServer + '/file/yljs'

const reject = function (errmsg) {
  return Promise.reject(new Error('FileDownload:' + errmsg))
}

const getFileName = function (resp) {
  // debugger
  let disp = resp.headers['Content-Disposition'.toLowerCase()]
  let parter = new RegExp('filename=(.+);')
  let rst = parter.exec(disp)
  if (Array.isArray(rst) && rst.length > 1) {
    return rst[1]
  } else {
    return null
  }
}

const getMIME = function (resp) {
  return resp.headers['Content-Type'.toLowerCase()]
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

    return new Promise((resolve, reject) => {
      myaxios.get(BaseURL + '/' + area + '/' + fileid).then(resp => {
        // debugger
        return resolve({ data: resp.data, name: getFileName(resp), mime: getMIME(resp) })
      }).catch(err => {
        return reject(err)
      })
    })
  }
}
