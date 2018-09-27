import store from '@/store/index'
import axios from '@/plugin/axios'
const YLJSBaseURL = 'http://localhost:5002/api/yljs'

const debug = true

export default {
  BaseURL: YLJSBaseURL,
  axios,
  getUserId () {
    return store.state.d2admin.user.info.uuid
  },
  debug,
  resolve (data) {
    return Promise.resolve({ code: 1, msg: null, data })
  },
  reject (errmsg) {
    return Promise.reject(new Error(errmsg))
  }
}
