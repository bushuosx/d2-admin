import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import { version } from '../../package'

const adapter = new LocalStorage(`d2admin-${version}`)
const db = low(adapter)

// 初始化数据库
db.defaults({
  // 新
  sys: {},
  db: {},
  // 旧
  opened: [],
  database: [],
  databasePublic: {}
}).write()

export default db
