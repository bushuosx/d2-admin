const isDebug = process.env.VUE_APP_DEBUG === 't'
const SSO_URL = isDebug ? 'http://localhost:5000' : 'http://172.16.128.43:5000'
const SPA_URL = isDebug ? 'http://localhost:8080' : 'http://172.16.128.43'
const YLJS_URL = isDebug ? 'http://localhost:5002' : 'http://172.16.128.43:5002'

export default {
  isDebug,
  SSO_URL,
  SPA_URL,
  YLJS_URL
}
