import Constants from '../../Constants'

const getChildren = function (user) {
  if (!user || !Constants.hasRoles(user, [Constants.Roles.院级审核])) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    return [
      { path: `${Constants.BaseUrl}/ryjs/yjsh`, icon: 'clipboard', title: '医疗技术院级审核' },
      { path: `${Constants.BaseUrl}/manage/ry/delryphoto`, icon: 'clipboard', title: '删除人员个人照片' },
      { path: `${Constants.BaseUrl}/manage/ryks/banryks`, icon: 'clipboard', title: '删除人员归属的科室' },
      { path: `${Constants.BaseUrl}/report/ksryreport`, icon: 'clipboard', title: '医院人员信息完善报表' }
    ]
  }
}

export default function (user) {
  return {
    title: '院级审核员',
    icon: 'table',
    children: getChildren(user)
  }
}
