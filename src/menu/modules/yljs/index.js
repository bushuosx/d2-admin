import myprofile from './modules/myprofile'
import myks from './modules/myks'
import myjs from './modules/myjs'
import myyy from './modules/myyy'
import manage from './modules/manage'
import help from './modules/help'

// const getLoginUrl = function () {
//   if (process.env.NODE_ENV === 'production') {
//     return 'http://172.16.128.43/account/login/yljs'
//   } else {
//     return '/account/login/yljs'
//   }
// }

const isLogon = function (userInfo) {
  return !!userInfo && !!userInfo.uuid
}

const getChildren = function (userInfo) {
  let rst = []
  if (isLogon(userInfo)) {
    rst.push(myprofile(userInfo),
      myks(userInfo),
      myjs(userInfo),
      myyy(userInfo),
      manage(userInfo))
  }
  rst.push(help())
  return rst
}

const getMunu = function (userInfo) {
  return {
    path: '/yljs',
    title: '医疗技术管理系统',
    icon: 'medkit',
    children: getChildren(userInfo)
  }
}

export default getMunu
