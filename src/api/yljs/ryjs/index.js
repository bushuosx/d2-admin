import parent from '../index'
import { Message } from 'element-ui'
const BaseURL = parent.BaseURL + '/ryjs'

export default {
  BaseURL,
  getbyry (ryid, pageIndex = 1) {
    if (!ryid || ryid === undefined) {
      let msg = '人员ID不能为空！'
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(msg)
    }
    let url = this.BaseURL + '/getbyry/' + ryid
    if (pageIndex && pageIndex !== undefined) {
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  },
  getbyryandjs (ryid, jsname, pageIndex = 1) {
    if (!ryid || ryid === undefined) {
      let msg = '人员ID不能为空！'
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(msg)
    }
    if (!jsname || jsname === undefined) {
      let msg = '技术名称不能为空！'
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(msg)
    }
    let url = this.BaseURL + '/getbyryandjs/' + ryid + '/' + jsname
    if (pageIndex && pageIndex !== undefined) {
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  },
  createryjs (jsids, fileids) {
    if (!jsids || jsids === undefined || jsids.length === 0) {
      return Promise.reject(new Error('技术id不能为空'))
    }
    if (!fileids || fileids === undefined || fileids.length === 0) {
      return Promise.reject(new Error('支撑材料不能为空'))
    }

    let url = this.BaseURL + '/postlist'
    return parent.axios.post(url, { jsidlist: jsids, fileidlist: fileids, ryid: parent.getUserId() })
  }
}
