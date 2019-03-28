import ksshy from './modules/ksshy'
import yyshy from './modules/yyshy'
import webmanager from './modules/webmanager'
import ksjsmanager from './modules/ksjsmanager'
import Constants from '../Constants'

export default function (user) {
  return {
    title: '管理模块',
    icon: 'lock',
    children: [
      { path: `${Constants.BaseUrl}/ryrole/manage`, icon: 'arrows', title: '人员角色分配' },
      ksshy(user),
      ksjsmanager(user),
      yyshy(user),
      webmanager(user)
    ]
  }
}
