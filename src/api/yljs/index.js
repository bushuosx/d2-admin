import store from '@/store/index'
import env from '@/libs/util.env.js'
import axios from '@/plugin/axios'
const APIServer = env.YLJS_URL

// const debug = false

export default {
  BaseURL: APIServer + '/api/yljs',
  APIServer,
  axios,
  getUserId () {
    return store.state.d2admin.user.info.id
  }
  // debug,
  // resolve (data) {
  //   return Promise.resolve({ code: 1, msg: null, data })
  // },
  // reject (errmsg) {
  //   return Promise.reject(new Error(errmsg))
  // }
}
