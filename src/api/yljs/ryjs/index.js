import axiosService from '@/plugin/axios'
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
    return axiosService.get(url)
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
    return axiosService.get(url)
  }
}
