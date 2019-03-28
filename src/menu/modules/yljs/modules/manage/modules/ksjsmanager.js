import Constants from '../../Constants'
const { hasRoles, Roles, InvalidMessage, BaseUrl } = Constants

const getChildren = function (user) {
  if (!user || !user.ksid || !hasRoles(user, [Roles.科室技术创建])) {
    return [{ title: InvalidMessage }]
  } else {
    // const ksid = user.ksid
    return [
      { path: `${BaseUrl}/ksjs/create`, icon: 'search', title: '增加科室技术' }
    ]
  }
}

export default function (user) {
  return {
    title: '科级技术管理员',
    icon: 'table',
    children: getChildren(user)
  }
}
