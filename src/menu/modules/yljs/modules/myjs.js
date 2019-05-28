import Constants from './Constants'

const getChildren = function (user) {
  if (!user || !user.id) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    return [
      { path: `${Constants.BaseUrl}/ryjs/listbyry/${user.id}`, icon: 'list', title: '个人技术一览' },
      { path: `${Constants.BaseUrl}/ryjs/create`, icon: 'calendar-plus-o', title: '申请技术授权' }
    ]
  }
}

export default function (user) {
  return {
    title: '我的技术',
    icon: 'heartbeat',
    children: getChildren(user)
  }
}
