export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {
      name: ''
    }
  },
  mutations: {
    /**
     * @description 设置用户数据
     * @param {Object} state vuex state
     * @param {*} info info
     */
    infoSet (state, info) {
      // store 赋值
      state.info = info
      // 持久化
      this.commit('d2admin/util/dbValueSetByUser', {
        dbName: 'sys',
        path: 'user.info',
        value: info
      })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} state vuex state
     */
    async infoLoad (state) {
      // store 赋值
      state.info = await this.dispatch('d2admin/util/dbValueGetByUser', {
        dbName: 'sys',
        path: 'user.info',
        defaultValue: '请重新登陆'
      })
    }
  }
}
