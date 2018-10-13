// 设置文件
import setting from '@/setting.js'
import { getHeaderMenu } from '@/menu'

export default {
  namespaced: true,
  state: {
    // 用户信息
    info: setting.user.info
  },
  mutations: {
    /**
     * @description 设置用户数据
     * @param {Object} state vuex state
     * @param {*} info info
     */
    set (state, info) {
      // store 赋值
      state.info = info
      // 持久化
      this.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.info',
        value: info,
        user: true
      })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} state vuex state
     */
    async load (state) {
      // store 赋值
      state.info = await this.dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'user.info',
        defaultValue: setting.user.info,
        user: true
      })

      // 重新加载菜单
      // 设置顶栏菜单
      this.commit('d2admin/menu/headerSet', getHeaderMenu(state.info))
      // 初始化菜单搜索功能
      this.commit('d2admin/search/init', getHeaderMenu(state.info))
    }
  },
  getters: {
    userInfo: s => { return s.info }
  }
}
