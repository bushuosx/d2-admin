import Constants from './modules/Constants'
import myprofile from './modules/myprofile'
import myks from './modules/myks'
import myjs from './modules/myjs'
import myyy from './modules/myyy'
import manage from './modules/manage'
import help from './modules/help'

import util from '@/libs/util'

const getChildren = function (store) {
  // debugger
  let user = util.user(store)
  let rst = []

  if (!user) {
    return rst
  }

  // console.log(Constants.BaseUrl)
  // debugger

  if (user.isLogon()) {
    Constants.pushIfItem(rst, myprofile(user))
    Constants.pushIfItem(rst, myks(user))
    Constants.pushIfItem(rst, myjs(user))
    Constants.pushIfItem(rst, myyy(user))
    Constants.pushIfItem(rst, manage(user))
  }
  Constants.pushIfItem(rst, help())
  return rst
}

const getMenu = function (store) {
  return {
    path: '/yljs',
    title: '医疗技术管理系统',
    icon: 'medkit',
    children: getChildren(store)
  }
}

export default getMenu
