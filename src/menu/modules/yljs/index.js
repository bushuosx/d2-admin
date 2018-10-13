import myprofile from './modules/myprofile'
import myks from './modules/myks'
import myjs from './modules/myjs'
import myyy from './modules/myyy'
import manage from './modules/manage'
import help from './modules/help'

const getMunu = function (userInfo) {
  return {
    path: '/yljs',
    title: '医疗技术管理系统',
    icon: 'medkit',
    children: [
      myprofile(userInfo),
      myks(userInfo),
      myjs(userInfo),
      myyy(userInfo),
      manage(userInfo),
      help(userInfo)
    ]
  }
}

export default getMunu
