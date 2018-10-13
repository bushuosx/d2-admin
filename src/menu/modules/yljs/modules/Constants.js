export default {
  InvalidMessage: '无法显示！',
  BaseUrl: '/yljs',
  Roles: {
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
  },
  hasRoles (user, roles) {
    if (!user || !Array.isArray(user.roles) || !Array.isArray(roles)) {
      return false
    }
    let myroles = user.roles
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
  }
}
