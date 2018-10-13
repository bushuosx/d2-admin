import Constants from './Constants'

const getChildren = function (user) {
  if (!user || !user.uuid) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    const userid = user.uuid
    return [
      { path: `ryjs/index/${userid}`, title: '个人技术一览' },
      { path: `ryjs/create`, title: '申请技术授权' }
    ]
  }
}

export default function (user) {
  return {
    title: '我的技术',
    icon: 'table',
    children: getChildren(user)
  }
}
