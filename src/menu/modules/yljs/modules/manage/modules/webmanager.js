import Constants from '../../Constants'

const getChildren = function (user) {
  if (!user) {
    return undefined
  } else {
    let rst = []
    if (user.hasAnyPermission([user.Permissions.人员创建])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/ry/importry`, title: '导入员工' })
    }
    if (user.hasAnyPermission([user.Permissions.科室创建])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/ks/importks`, title: '导入科室' })
    }
    if (user.hasAnyPermission([user.Permissions.技术创建])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/js/importjs`, title: '导入技术' })
      rst.push({ path: `${Constants.BaseUrl}/manage/js/importbmk`, title: '导入技术编码库' })
      rst.push({ path: `${Constants.BaseUrl}/manage/js/setjsbmdy`, title: '设置技术编码对应' })
    }
    if (user.hasAnyPermission([user.Permissions.技术修改])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/js/updatejs`, title: '修改医疗技术' })
    }
    if (user.hasAnyPermission([user.Permissions.人员修改])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/ry/updatery`, title: '修改人员信息' })
    }

    if (user.hasAnyPermission([user.Permissions.网站角色管理权限, user.Permissions.超级管理权限])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/zylb/import`, title: '导入专业类别' })
    }

    if (user.hasAnyPermission([user.Permissions.医院角色管理权限, user.Permissions.网站角色管理权限, user.Permissions.超级管理权限])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/ry/getemployees`, title: '查询员工' })
      rst.push({ path: `${Constants.BaseUrl}/manage/ry/setksmanager`, title: '设置科室管理员' })
    }

    // if (rst.length === 0) {
    //   rst.push({ title: Constants.InvalidMessage })
    // }
    return rst
  }
}

export default function (user) {
  let children = getChildren(user)
  if (!Array.isArray(children) || children.length === 0) {
    return undefined
  } else {
    return {
      title: '网站管理员',
      icon: 'table',
      children
    }
  }
}
