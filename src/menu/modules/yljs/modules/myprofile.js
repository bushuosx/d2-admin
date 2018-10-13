import Constants from './Constants'

const getChildren = function (user) {
  if (!user || !user.uuid) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    const pre = '/yljs'
    const userid = user.uuid
    return [
      { path: `${pre}/ryprofile/index/${userid}`, title: '档案信息' },
      { path: `${pre}/ryrole/index/${userid}`, title: '我的网站角色' }
    ]
  }
}

export default function (userinfo) {
  return {
    title: '我的资料',
    icon: 'table',
    children: getChildren(userinfo)
  }
}
