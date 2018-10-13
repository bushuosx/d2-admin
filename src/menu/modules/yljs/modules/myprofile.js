import Constants from './Constants'

const getChildren = function (user) {
  if (!user || !user.uuid) {
    return [{ title: Constants.InvalidMessage }]
  } else {
    const userid = user.uuid
    return [
      { path: `${Constants.BaseUrl}/ryprofile/index/${userid}`, icon: 'id-card', title: '档案信息' },
      { path: `${Constants.BaseUrl}/ryrole/index/${userid}`, icon: 'universal-access', title: '我的网站角色' }
    ]
  }
}

export default function (userinfo) {
  return {
    title: '我的资料',
    icon: 'user',
    children: getChildren(userinfo)
  }
}
