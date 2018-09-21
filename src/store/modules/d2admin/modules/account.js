import util from '@/libs/util.js'
import Cookies from 'js-cookie'
export default {
  namespaced: true,
  actions: {
    logincallback ({
      commit
    }, {
      vm,
      debug = false,
      route = {
        name: 'index'
      } }) {
      console.log(Cookies.get())
      debugger

      // 查看Cookie，是否已完成登录
      let token = Cookies.get('spasid')
      let uuid = Cookies.get('spasub')
      let name = Cookies.get('spaname')

      if (debug === true) {
        token = 'guesttoken'
        uuid = 'guest000'
        name = 'guest'
      }

      if (!token || token === '') {
        return
      }
      if (!uuid || uuid === '') {
        return
      }
      if (!name || name === '') {
        return
      }

      util.cookies.set('uuid', uuid)
      util.cookies.set('token', token)
      // 设置 vuex 用户信息
      commit('d2admin/user/set', {
        name: name
      }, { root: true })
      // 用户登录后从持久化数据加载一系列的设置
      commit('load')
      // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
      const path = util.cookies.get('redirect')
      // 根据是否存有重定向页面判断如何重定向
      vm.$router.replace(path ? { path } : route)
      // 删除 cookie 中保存的重定向页面
      util.cookies.remove('redirect')
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
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        // 跳转路由
        vm.$router.push({
          name: 'login'
        })
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
