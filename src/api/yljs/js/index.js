import axiosService from '@/plugin/axios'
import parent from '../index'
import { Message } from 'element-ui'
const BaseURL = parent.BaseURL + '/js'

export default {
  BaseURL,
  getbyname (name, pageIndex = 1) {
    if (!name || name === undefined) {
      let msg = '用户名不能为空！'
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(msg)
    }
    let url = this.BaseURL + '/getbyname/' + name
    if (pageIndex && pageIndex !== undefined) {
      url += '/' + pageIndex
    }
    return axiosService.get(url)
  },
  getbycode (code, pageIndex = 1) {
    if (!code || code === undefined) {
      let msg = '技术编码不能为空！'
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(msg)
    }
    let url = this.BaseURL + '/getbycode/' + code
    if (pageIndex && pageIndex !== undefined) {
      url += '/' + pageIndex
    }
    return axiosService.get(url)
  }
}
