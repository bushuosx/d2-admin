import Constants from './Constants'

const getChildren = function (user) {
  if (!user || !user.id) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    return [
      { path: `${Constants.BaseUrl}/ryprofile/index/${user.id}`, icon: 'id-card', title: '档案信息' },
      { path: `${Constants.BaseUrl}/ryrole/index/${user.id}`, icon: 'universal-access', title: '我的网站角色' }
    ]
  }
}

export default function (user) {
  return {
    title: '我的资料',
    icon: 'user',
    children: getChildren(user)
  }
}
