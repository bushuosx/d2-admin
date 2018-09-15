import axiosService from '@/plugin/axios'
import parent from '../index'

const BaseURL = parent.BaseURL + '/ry'

export default {
  BaseURL,
  getbyname (name, pageIndex = 1) {
    if (!name || name === undefined) {
      let msg = '用户名不能为空！'
      this.$message({
        message: msg,
        type: 'danger'
      })
      this.$log.danger(msg)
      return
    }
    let url = this.BaseURL + '/getbyname/' + name
    if (pageIndex && pageIndex !== undefined) {
      url += '/' + pageIndex
    }
    return axiosService.get(url)
  }
}
