import Constants from './Constants'

const getChildren = function (user) {
  if (!user || !user.uuid) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    const userid = user.uuid
    return [
      { path: `${Constants.BaseUrl}/ryjs/index/${userid}`, title: '个人技术一览' },
      { path: `${Constants.BaseUrl}/ryjs/create`, title: '申请技术授权' }
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
