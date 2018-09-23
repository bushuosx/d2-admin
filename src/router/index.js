import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import routes from './routes'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  mode: 'history',
  routes
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach((to, from, next) => {
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.requiresAuth)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    // const token = util.cookies.get('token')
    const token = util.cookies.get('uuid')
    if (token && token !== 'undefined') {
      next()
    } else {
      // const userInfo = store.state.d2admin.user.info
      // if (userInfo && userInfo !== 'undefined') {
      //   next()
      // } else {
      //
      // 将当前预计打开的页面完整地址临时存储 登录后继续跳转
      // 这个 cookie(redirect) 会在登录后自动删除
      util.cookies.set('redirect', to.fullPath)
      // 没有登录的时候跳转到登录界面
      // next({
      //   name: 'login'
      // })
      window.location.href = '/account/login/yljs'
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})

router.afterEach(to => {
  // 需要的信息
  const app = router.app
  const { name, params, query } = to
  // 多页控制 打开新的页面
  app.$store.commit('d2admin/page/open', { name, params, query })
  // 更改标题
  util.title(to.meta.title)
})

export default router
