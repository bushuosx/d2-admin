import Constants from './Constants'

const getChildren = function (user) {
  if (!user || !user.ksid) {
    return [{ path: `${Constants.BaseUrl}/ry/ks`, title: '科室信息' }]
  } else {
    const ksid = user.ksid
    return [
      { path: `${Constants.BaseUrl}/ks/index/${ksid}`, title: '科室信息' },
      { path: `${Constants.BaseUrl}/ks/rylist/${ksid}`, title: '科室人员' },
      { path: `${Constants.BaseUrl}/ks/jslist/${ksid}`, title: '科室技术' }
    ]
  }
}

export default function (userinfo) {
  return {
    title: '我的科室',
    icon: 'university',
    children: getChildren(userinfo)
  }
}
