import store from '@/store'
import util from '@/libs/util'
import { Message } from 'element-ui'

export default {
  install (Vue, options) {
    // 快速打印 log
    Vue.prototype.$log = util.log
    // 快速记录日志
    Vue.prototype.$logAdd = function (info, show = true) {
      // store 赋值
      store.dispatch('d2admin/log/add', {
        type: 'log',
        info
      })
      // 显示在控制台
      if (show && process.env.NODE_ENV === 'development') {
        util.log.default(info)
      }
    }

    Vue.prototype.$logError = function (errmsg, show = true) {
      // 添加到日志
      store.dispatch('d2admin/log/add', {
        type: 'error',
        err: new Error(errmsg)
      })
      // 打印到控制台
      if (show && process.env.NODE_ENV === 'development') {
        util.log.danger('>>>>>> Error >>>>>>')
        console.log(errmsg)
      }
      // 显示提示
      Message({
        message: errmsg,
        type: 'error'
      })
    }
  }
}
