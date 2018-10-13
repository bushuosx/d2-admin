const getChildren = function (user) {
  if (!user || !user.ksid) {
    return [{ path: `/yljs/ry/ks`, title: '科室信息' }]
  } else {
    const pre = '/yljs/ks'
    const ksid = user.ksid
    return [
      { path: `${pre}/index/${ksid}`, title: '科室信息' },
      { path: `${pre}/rylist/${ksid}`, title: '科室人员' },
      { path: `${pre}/jslist/${ksid}`, title: '科室技术' }
    ]
  }
}

export default function (userinfo) {
  return {
    title: '我的科室',
    icon: 'table',
    children: getChildren(userinfo)
  }
}
