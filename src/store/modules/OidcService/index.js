// import axios from 'axios'
import Oidc from 'oidc-client-axios'

var config = {
  authority: 'http://localhost:5000',
  client_id: 'vue',
  redirect_uri: 'http://localhost:8080/oidc/callback',
  response_type: 'id_token token',
  scope: 'openid profile',
  post_logout_redirect_uri: 'http://localhost:8080/index.html'
}

Oidc.Log.logger = console
Oidc.Log.level = Oidc.Log.INFO

var mgr = new Oidc.UserManager(config)

mgr.events.addUserLoaded(function (user) {
  console.log('New User Loaded', arguments)
  console.log('Acess_token: ', user.access_token)
})

mgr.events.addUserSignedOut(function () {
  alert('Going out!')
  console.log('UserSignedOut', arguments)
  // mgr.removeUser();
  mgr.signoutRedirect().then(function (resp) {
    console.log('signed out', resp)
  }).catch(function (err) {
    console.log(err)
  })
})

export default {
  namespaced: true,

  state: {
    UserManager: mgr
  },

  getters: {
    UserManager: s => { return s.UserManager }
  },

  actions: {
    login () {
      mgr.signinRedirect()
    },

    isLogin () {
      mgr.getUser().then(function (user) {
        if (user) {
          console.log('User logged in', user.profile)
          return true
        } else {
          console.log('User not logged in')
          return false
        }
      })
    },

    logout () {
      mgr.signoutRedirect()
    },

    saveUser ({ commit }, {
      vm,
      userid,
      route = {
        name: 'index'
      }
    }) {
      // 存至DB
      commit('d2admin/user/set', {
        name: userid
      }, { root: true })
      // 重新加载用户
      commit('load')
    }
  }
}
