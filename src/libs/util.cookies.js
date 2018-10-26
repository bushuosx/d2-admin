import Cookies from 'js-cookie'
import setting from '@/setting.js'

const cookies = {}

// const cookieExpires = 1 / 24

/**
 * @description 存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} setting cookie setting
 */
cookies.set = function (name = 'default', value = '', cookieSetting = {}) {
  // let currentCookieSetting = {
  //   expires: cookieExpires
  // }
  // Object.assign(currentCookieSetting, cookieSetting)
  Cookies.set(`d2admin-${setting.releases.version}-${name}`, value, cookieSetting)
}

/**
 * @description 拿到 cookie 值
 * @param {String} name cookie name
 */
cookies.get = function (name = 'default') {
  return Cookies.get(`d2admin-${setting.releases.version}-${name}`)
}

/**
 * @description 拿到 cookie 全部的值
 */
cookies.getAll = function () {
  return Cookies.get()
}

/**
 * @description 删除 cookie
 * @param {String} name cookie name
 */
cookies.remove = function (name = 'default') {
  return Cookies.remove(`d2admin-${setting.releases.version}-${name}`)
}

export default cookies
