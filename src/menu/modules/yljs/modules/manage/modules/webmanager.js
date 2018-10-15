import Constants from '../../Constants'

const getChildren = function (user) {
  if (!user || !Constants.hasRoles(user, [Constants.Roles.网站角色管理权限])) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    return [
      { path: `${Constants.BaseUrl}/manage/ry/importry`, title: '导入员工' },
      { path: `${Constants.BaseUrl}/manage/ks/importks`, title: '导入科室' },
      { path: `${Constants.BaseUrl}/manage/zylb/import`, title: '导入专业类别' },
      { path: `${Constants.BaseUrl}/manage/js/importjs`, title: '导入技术' },
      { path: `${Constants.BaseUrl}/manage/js/importbmk`, title: '导入技术编码库' },
      { path: `${Constants.BaseUrl}/manage/js/setjsbmdy`, title: '设置技术编码对应' },
      { path: `${Constants.BaseUrl}/manage/ry/setksmanager`, title: '设置科室管理员' }
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
