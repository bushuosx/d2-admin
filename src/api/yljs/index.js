import store from '@/store/index'
import axios from '@/plugin/axios'
const YLJSBaseURL = 'http://localhost:5002/api/yljs'

export default {
  BaseURL: YLJSBaseURL,
  axios,
  getUserId () {
    return store.state.d2admin.user.info.uuid
  }
}
