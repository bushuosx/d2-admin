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
        name: 'yljs'
      } }) {
      console.log(Cookies.get())
      debugger

      // 要检索的值
      let token
      let uuid
      let name
      let roles

      // debug登录
      if (debug === true) {
        // token = 'guesttoken'
        // uuid = '019932A8-194D-4785-66F5-08D622B6098B' // YWBPC这是无意义的guid
        uuid = '5097B183-ADEF-4DB5-FD12-08D620975F69' // JJPC
        name = 'jj'
      } else {
        // 查看Cookie，是否已完成登录
        token = Cookies.get('spatoken')
        uuid = Cookies.get('spasub')
        name = Cookies.get('spaname')
        roles = Cookies.get('sparoles')

        if (!token || token === '') {
          return
        }
        if (!uuid || uuid === '') {
          return
        }
        if (!name || name === '') {
          return
        }
        if (!roles && roles !== undefined) {
          roles = JSON.parse(roles)
        } else {
          roles = []
        }
      }

      // 移除不必要的token
      Cookies.remove('spatoken')
      Cookies.remove('spasub')
      Cookies.remove('spaname')
      Cookies.remove('sparoles')

      // 设置自留cookie
      util.cookies.set('uuid', uuid)
      // util.cookies.set('token', token) // 这里是jj删除的
      // 设置 vuex 用户信息
      commit('d2admin/user/set', {
        name: name,
        uuid,
        token,
        roles
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
        // util.cookies.remove('token') // 这里是jj删除的
        util.cookies.remove('uuid')
        // 跳转路由
        vm.$router.push({
          name: 'yljs'
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
