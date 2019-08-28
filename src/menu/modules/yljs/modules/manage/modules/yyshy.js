import Constants from '../../Constants'

const getChildren = function (user) {
  if (!user || !user.hasAnyPermission([user.Permissions.院级审核])) {
    return undefined
  } else {
    return [
      { path: `${Constants.BaseUrl}/ryjs/yjsh`, icon: 'clipboard', title: '医疗技术院级审核' },
      { path: `${Constants.BaseUrl}/manage/ry/delryphoto`, icon: 'clipboard', title: '删除人员个人照片' },
      { path: `${Constants.BaseUrl}/manage/ryks/banryks`, icon: 'clipboard', title: '删除人员归属的科室' },
      { path: `${Constants.BaseUrl}/manage/ryks/updatezw`, icon: 'clipboard', title: '设置人员科室职务' },
      { path: `${Constants.BaseUrl}/report/ksryreport`, icon: 'clipboard', title: '医院人员信息完善报表' }
    ]
  }
}

export default function (user) {
  let children = getChildren(user)
  if (!Array.isArray(children) || children.length === 0) {
    return undefined
  } else {
    return {
      title: '院级审核员',
      icon: 'table',
      children
    }
  }
}
