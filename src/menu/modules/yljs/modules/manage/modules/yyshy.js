import Constants from '../../Constants'

const getChildren = function (user) {
  if (!user || !Constants.hasRoles(user, [Constants.Roles.院级审核])) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    return [
      { path: `${Constants.BaseUrl}/ks/list`, title: '全院科室列表' }
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
