import store from '@/store/index'
import axios from '@/plugin/axios'
const APIServer = process.env.NODE_ENV === 'production' && process.env.VUE_APP_DEBUG !== 't' ? 'http://172.16.128.43:5002' : 'http://localhost:5002'

const debug = false

export default {
  BaseURL: APIServer + '/api/yljs',
  APIServer,
  axios,
  getUserId () {
    return store.state.d2admin.user.info.id
  },
  debug,
  resolve (data) {
    return Promise.resolve({ code: 1, msg: null, data })
  },
  reject (errmsg) {
    return Promise.reject(new Error(errmsg))
  }
}
