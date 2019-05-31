import util from '@/libs/util.js'
import Oidc from '@/api/oidc'
export default {
  namespaced: true,
  actions: {
    logincallback ({ commit },
      {
        vm,
        yljsuser,
        route = {
          name: 'yljs'
        }
      }) {
      // debugger
      // console.log(Cookies.get())

      // 记录uuid
      if (!yljsuser || !yljsuser.id) {
        vm.$message.error('登录出错:用户ID未知')
        return
      } else {
        util.cookies.set('userid', yljsuser.id)
      }

      // 设置 vuex 用户信息
      commit('d2admin/user/set', yljsuser, { root: true })
      // 用户登录后从持久化数据加载一系列的设置
      commit('load')
      // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
      const path = util.cookies.get('redirect')
      // 删除 cookie 中保存的重定向页面
      util.cookies.remove('redirect')
      // 根据是否存有重定向页面判断如何重定向
      vm.$router.replace(path ? { path } : { path: '/yljs' })
    },
    /**
    * @description 注销用户并返回登录页面
    * @param {Object} param context
    * @param {Object} param vm {Object} vue 实例
    * @param {Object} param confirm {Boolean} 是否需要确认
    */
    logout ({ commit }, { vm, confirm = false }) {
      /**
      * @description 注销
      */
      function logout () {
        // Cookies.remove('spatoken')
        // Cookies.remove('spauser')
        util.cookies.remove('userid')

        // 设置 vuex 用户信息
        commit('d2admin/user/set', {}, { root: true })
        // 用户登录后从持久化数据加载一系列的设置
        commit('load')

        // window.location.href = '/yljs'
        Oidc.logout()
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        vm.$confirm('注销当前账户吗?  打开的标签页和用户设置将会被保存。', '确认操作', {
          confirmButtonText: '确定注销',
          cancelButtonText: '放弃',
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            vm.$message('放弃注销用户')
          })
      } else {
        logout()
      }
    },
    login ({ commit }, { vm, redirectUrl }) {
      if (redirectUrl) {
        util.cookies.set('redirect', redirectUrl)
      }
      return Oidc.login()
    }
  },
  mutations: {
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} state vuex state
     */
    load (state) {
      // DB -> store 加载用户名
      this.commit('d2admin/user/load')
      // DB -> store 加载主题
      this.commit('d2admin/theme/load')
      // DB -> store 加载页面过渡效果设置
      this.commit('d2admin/transition/load')
      // DB -> store 持久化数据加载上次退出时的多页列表
      this.commit('d2admin/page/openedLoad')
      // DB -> store 持久化数据加载这个用户之前设置的侧边栏折叠状态
      this.commit('d2admin/menu/asideCollapseLoad')
    }
  }
}
