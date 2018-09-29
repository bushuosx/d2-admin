import store from '@/store/index'

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

export default {
  Roles,
  userRoles: store.state.d2admin.user.info.roles,
  // ksid: store.state.d2admin.user.info.ksid,
  hasRoles () {
    if (this.userRoles === null || this.userRoles === undefined || this.userRoles.length === undefined) {
      return false
    }
    for (let i in arguments) {
      let found = false
      for (let j in this.userRoles) {
        if (arguments[i] === this.userRoles[j]) {
          found = true
          break
        }
      }
      if (found === false) {
        return false
      }
    }
    return true
  }
}
