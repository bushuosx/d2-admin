import ksshy from './modules/ksshy'
import yyshy from './modules/yyshy'
import webmanager from './modules/webmanager'

export default function (user) {
  return {
    title: '管理模板',
    icon: 'table',
    children: [
      { path: `ryrole/manage`, title: '人员角色分配' },
      ksshy(user),
      yyshy(user),
      webmanager(user)
    ]
  }
}
