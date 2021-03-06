import store from '@/store/index'
import ryapi from '../api/yljs/ry'

const Roles = {
  人员创建: 101,
  人员修改: 102,
  人员删除: 103,

  科室创建: 201,
  科室修改: 202,
  科室删除: 203,

  技术创建: 301,
  技术修改: 302,
  技术删除: 303,

  科室技术创建: 401,
  科室技术修改: 402,
  科室技术删除: 403,

  科级审核: 9001,
  院级审核: 9002,

  科室角色管理权限: 9600,

  医院角色管理权限: 9700,

  网站角色管理权限: 9800,

  超级管理权限: 9900
}

const __getUserInfo = function () {
  if (!store || !store.state) {
    return undefined
  }
  return store.state.d2admin.user.info
}

export default {
  Roles,
  userId: __getUserInfo() ? __getUserInfo().uuid : undefined,
  userName: __getUserInfo() ? __getUserInfo().name : undefined,
  userRoles: __getUserInfo() ? __getUserInfo().roles : undefined,
  ksid: __getUserInfo() ? __getUserInfo().ksid : undefined,
  profileId: __getUserInfo() ? __getUserInfo().profileid : undefined,
  hasRoles (roles) {
    if (!Array.isArray(roles)) {
      return undefined
    }

    const myroles = __getUserInfo() ? __getUserInfo().roles : undefined
    if (!Array.isArray(myroles)) {
      return false
    }

    for (let i in roles) {
      let found = false
      for (let j in myroles) {
        if (roles[i] === myroles[j]) {
          found = true
          break
        }
      }
      if (found === false) {
        return false
      }
    }
    return true
  },
  refreshProfile () {
    return new Promise((resolve, reject) => {
      ryapi.refreshMe().then(res => {
        if (res.code === 1) {
          // 查询成功
          // 开始刷新
          let info = store.state.d2admin.user.info
          info.roles = res.data.profile.permissions
          info.ksid = res.data.profile.ksid
          info.profileid = res.data.profile.profileId
          resolve(info)
        } else {
          reject(new Error(res.msg))
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  isLogon () {
    return !!this.userId
  },
  isKSManager () {
    return this.hasRoles([this.Roles.科级审核])
  }
}
