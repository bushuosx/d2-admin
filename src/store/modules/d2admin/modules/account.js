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
      // debugger
      // console.log(Cookies.get())

      // 要检索的值
      let token
      let uuid
      let name
      let roles
      let ksid
      let profileid

      // debug登录
      if (debug === true) {
        // token = 'guesttoken'
        console.log(process.env)
        debugger
        if (process.env.VUE_APP_PC === 'JJPC') {
          uuid = '5097B183-ADEF-4DB5-FD12-08D620975F69'.toLowerCase() // JJPC
          ksid = 'ef11af9f-8cdb-4d2c-3386-08d62c131173'.toLowerCase() // JJPC
          profileid = 'A3A2C82E-1BFA-4AE2-30FE-08D62C19313E'.toLowerCase()
          name = 'jjpc'
        } else {
          uuid = '019932A8-194D-4785-66F5-08D622B6098B'.toLowerCase() // YWBPC
          ksid = 'bc139d6b-f23a-440d-ac80-08d622bc65bd' // ywbpc
          profileid = 'AA0946D2-0906-4A44-DD40-08D62CC2AF83'.toLowerCase() // ywbpc
          name = 'ywbpc'
        }
        roles = [101, 102, 103, 201, 202, 203, 301, 302, 303, 401, 402, 403, 9001, 9002, 9600, 9700, 9800, 9900]
      } else {
        // 查看Cookie，是否已完成登录
        uuid = Cookies.get('spasub')
        token = Cookies.get('spatoken')
        let profile = JSON.parse(Cookies.get('spaprofile'))
        name = profile.Name
        roles = profile.Permissions
        ksid = profile.KSID
        profileid = profile.ProfileID
        // name = Cookies.get('spaname')
        // roles = Cookies.get('sparoles')
        // ksid = Cookies.get('spaksid')

        if (!uuid) {
          return
        }
        if (!token) {
          return
        }
        if (!name) {
          name = uuid
        }
      }

      // 移除不必要的token
      Cookies.remove('spasub')
      Cookies.remove('spatoken')
      Cookies.remove('spaprofile')
      // Cookies.remove('spaname')
      // Cookies.remove('sparoles')
      // Cookies.remove('spaksid')

      // 设置自留cookie
      util.cookies.set('uuid', uuid)

      // util.cookies.set('token', token) // 这里是jj删除的
      // 设置 vuex 用户信息
      commit('d2admin/user/set', {
        name,
        uuid,
        token,
        roles,
        ksid,
        profileid
      }, { root: true })
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
        // 删除cookie
        // util.cookies.remove('token') // 这里是jj删除的
        util.cookies.remove('uuid')
        // Cookies.remove('access-token')
        // // 跳转路由
        // vm.$router.push({
        //   name: 'yljs'
        // })

        window.location.href = '/account/logout/yljs'
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
