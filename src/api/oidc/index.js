import Oidc from 'oidc-client'
import env from '@/libs/util.env.js'

const ssourl = env.SSO_URL
const spaurl = env.SPA_URL

const config = {
  authority: ssourl,
  client_id: 'yljsjsclient',
  redirect_uri: spaurl + '/yljs/logincallback',
  response_type: 'code',
  scope: 'openid gh yljs.jsclient',
  post_logout_redirect_uri: spaurl + '/yljs'
}

// const npmConfig = {
//   authority: ssourl,
//   client_id: 'yljsjsclient',
//   redirect_uri: spaurl + '/yljs/logincallback',
//   response_type: 'code',
//   scope: 'openid gh yljs.jsclient',
//   post_logout_redirect_uri: spaurl + '/yljs'
// }

const mgr = new Oidc.UserManager(config)

export default {
  namespaced: true,
  getUser: function () {
    return mgr.getUser()
  },
  async relogin () {
    await mgr.removeUser()
    return mgr.signinRedirect()
  },
  login () {
    return mgr.signinRedirect()
  },
  logout () {
    return mgr.signoutRedirect()
  },
  loginCallback () {
    return new Oidc.UserManager({ response_mode: 'query' }).signinRedirectCallback()
  }
}
