import Constants from '../../Constants'

const getChildren = function (user) {
  if (!user) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    let rst = []
    if (Constants.hasRoles(user, [Constants.Roles.人员创建])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/ry/importry`, title: '导入员工' })
    }
    if (Constants.hasRoles(user, [Constants.Roles.科室创建])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/ks/importks`, title: '导入科室' })
    }
    if (Constants.hasRoles(user, [Constants.Roles.技术创建])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/js/importjs`, title: '导入技术' })
      rst.push({ path: `${Constants.BaseUrl}/manage/js/importbmk`, title: '导入技术编码库' })
      rst.push({ path: `${Constants.BaseUrl}/manage/js/setjsbmdy`, title: '设置技术编码对应' })
    }
    if (Constants.hasRoles(user, [Constants.Roles.网站角色管理权限, Constants.Roles.超级管理权限])) {
      rst.push({ path: `${Constants.BaseUrl}/manage/zylb/import`, title: '导入专业类别' })
      rst.push({ path: `${Constants.BaseUrl}/manage/ry/setksmanager`, title: '设置科室管理员' })
    }

    if (rst.length === 0) {
      rst.push({ title: Constants.InvalidMessage })
    } else {
      rst.push({ path: `${Constants.BaseUrl}/manage/ry/getemployees`, title: '查询员工' })
    }
    return rst
  }
}

export default function (user) {
  return {
    title: '网站管理员',
    icon: 'table',
    children: getChildren(user)
  }
}
