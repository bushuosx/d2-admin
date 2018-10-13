import Constants from '../../Constants'

const getChildren = function (user) {
  if (!user || !Constants.hasRoles(user, [Constants.Roles.网站角色管理权限])) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    return [
      { path: `${Constants.BaseUrl}/manage/rymanager/add`, title: '导入员工' },
      { path: `${Constants.BaseUrl}/ks/list`, title: '导入科室' },
      { path: `${Constants.BaseUrl}/js/list`, title: '导入技术' },
      { path: `${Constants.BaseUrl}/manage/ksmanager/add`, title: '设置科室管理员' }
    ]
  }
}

export default function (user) {
  return {
    title: '网站管理员',
    icon: 'table',
    children: getChildren(user)
  }
}
