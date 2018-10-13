import Constants from '../../Constants'
const { hasRoles, Roles, InvalidMessage, BaseUrl } = Constants

const getChildren = function (user) {
  if (!user || !user.ksid || !hasRoles(user, [Roles.科级审核])) {
    return [{ title: InvalidMessage }]
  } else {
    const ksid = user.ksid
    return [
      { path: `${BaseUrl}/ryks/kjsh/${ksid}`, title: '审核入科申请' },
      { path: `${BaseUrl}/ryjs/kjsh/${ksid}`, title: '审核技术授权申请' },
      { path: `${BaseUrl}/ryprofile/kjsh/${ksid}`, title: '审核人员档案' }
    ]
  }
}

export default function (user) {
  return {
    title: '科级审核员',
    icon: 'table',
    children: getChildren(user)
  }
}
