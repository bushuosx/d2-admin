// import ksshy from './modules/ksshy'
import yyshy from './modules/yyshy'
import webmanager from './modules/webmanager'
// import ksjsmanager from './modules/ksjsmanager'
import Constants from '../Constants'

function getChildren (user) {
  if (!user) {
    return undefined
  }
  let rst = []
  if (user.hasAnyPermission([user.Permissions.科室角色管理权限, user.Permissions.医院角色管理权限, user.Permissions.网站角色管理权限, user.Permissions.超级管理权限], null, true)) {
    rst.push({ path: `${Constants.BaseUrl}/ryrole/manage`, icon: 'arrows', title: '人员角色分配' })
  }
  Constants.pushIfItem(rst, yyshy(user))
  Constants.pushIfItem(rst, webmanager(user))
  return rst
}

export default function (user) {
  let children = getChildren(user)
  if (!Array.isArray(children) || children.length === 0) {
    return undefined
  } else {
    return {
      title: '管理模块',
      icon: 'lock',
      children
    }
  }
}
