import Constants from './Constants'

const getChildren = function (user) {
  if (!user || !user.ksid) {
    return [{ path: `${Constants.BaseUrl}/ry/ks`, title: '科室信息' }]
  } else {
    const ksid = user.ksid
    return [
      // { path: `${Constants.BaseUrl}/ks/index/${ksid}`, icon: 'tree', title: '科室信息' },
      { path: `${Constants.BaseUrl}/ry/ks`, icon: 'tree', title: '科室信息' },
      { path: `${Constants.BaseUrl}/ks/rylist/${ksid}`, icon: 'address-book', title: '科室人员' },
      { path: `${Constants.BaseUrl}/ryjs/listbyks/${ksid}`, icon: 'archive ', title: '科室技术' }
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
