import Constants from './Constants'

const getChildren = function (user) {
  let rst = []
  if (user && Array.isArray(user.ksList)) {
    let ksList = user.ksList
    for (let i in ksList) {
      let ksid = ksList[i].id
      let tmpChildren = [
        { path: `${Constants.BaseUrl}/ks/index/${ksid}`, icon: 'tree', title: '科室信息' },
        { path: `${Constants.BaseUrl}/ryjs/listbyks/${ksid}`, icon: 'archive ', title: '科室已授权技术' },
        { path: `${Constants.BaseUrl}/ksjs/list/${ksid}`, icon: 'archive ', title: '科室维护的技术列表' }
      ]

      if (user.hasAnyPermission([user.Permissions.科室技术创建], ksid)) {
        tmpChildren.push({ path: `${Constants.BaseUrl}/ksjs/create/${ksid}`, icon: 'clipboard', title: '增加科室技术列表' })
      }

      if (user.isKJSHManager(ksid)) {
        tmpChildren.push(
          { path: `${Constants.BaseUrl}/ryjs/kjsh/${ksid}`, icon: 'search', title: '审核技术授权申请' },
          { path: `${Constants.BaseUrl}/ryprofile/needkjsh/${ksid}`, icon: 'search', title: '审核人员档案' }
        )
      }

      if (user.isKJSHManager(ksid) || user.hasAnyPermission([user.Permissions.科室角色管理权限], ksid)) {
        tmpChildren.push(
          { path: `${Constants.BaseUrl}/ryks/kjsh/${ksid}`, icon: 'search', title: '审核入科申请' })
      }

      if (user.hasAnyPermission([user.Permissions.科室角色管理权限], ksid)) {
        tmpChildren.push(
          { path: `${Constants.BaseUrl}/ks/ry/${ksid}`, icon: 'address-book', title: '管理科室人员' })
      }

      rst.push({
        title: ksList[i].mc,
        icon: 'university',
        children: tmpChildren
      })
    }
  }
  rst.push({ path: `${Constants.BaseUrl}/ry/ks`, title: '申请的全部科室' })
  return rst
}

export default function (userinfo) {
  return {
    title: '我的科室',
    icon: 'university',
    children: getChildren(userinfo)
  }
}
