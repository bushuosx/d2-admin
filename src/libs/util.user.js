// import store from '@/store/index'

const KSManagePermissions = {
  科室技术创建: 401,
  科室技术修改: 402,
  科室技术删除: 403,

  科级审核: 9001,

  科室角色管理权限: 9600
}

function isKSPermission (p) {
  // debugger
  if (!p) return false
  for (let i in KSManagePermissions) {
    if (KSManagePermissions[i] === p) return true
  }
  return false
}

const Permissions = {
  人员创建: 101,
  人员修改: 102,
  人员删除: 103,

  科室创建: 201,
  科室修改: 202,
  科室删除: 203,

  技术创建: 301,
  技术修改: 302,
  技术删除: 303,

  院级审核: 9002,

  医院角色管理权限: 9700,

  网站角色管理权限: 9800,

  超级管理权限: 9900,

  ...KSManagePermissions
}

const __getUserInfo = function (store) {
  if (!store || !store.state || !store.state.d2admin || !store.state.d2admin.user) {
    return undefined
  }
  return store.state.d2admin.user.info
}

export default function (store) {
  const info = __getUserInfo(store)
  const tmp = {
    Permissions,

    // 有permission中任一权限，即通过
    hasAnyPermission (permissions, ksid, dotcheckks) {
      // debugger
      if (!Array.isArray(permissions) || permissions.length === 0) {
        return false
      }

      const myroles = info ? info.roleList : undefined
      if (!Array.isArray(myroles) || myroles.length === 0) {
        return false
      }

      // 遍历要检查的权限
      for (let i in permissions) {
        // 遍历用户的角色
        for (let j in myroles) {
          let index = myroles[j].permissions.findIndex(x => x.value === permissions[i])
          if (index !== -1) {
            if (isKSPermission(permissions[i]) && !dotcheckks) {
              // 检验科室
              let tmp = !!ksid && ksid === myroles[j].ks.id
              if (tmp) return true
            } else {
              return true
            }
          }
        }
      }
      return false
    },
    hasYJGLPermission () {
      return this.hasAnyPermission([Permissions.医院角色管理权限, Permissions.网站角色管理权限, Permissions.超级管理权限])
    },
    hasAnyGLPermission () {
      return this.hasAnyPermission([Permissions.科室角色管理权限, Permissions.医院角色管理权限, Permissions.网站角色管理权限, Permissions.超级管理权限], null, true)
    },
    roleHasAnyPermission (role, permissions) {
      if (!role || !Array.isArray(role.permissions) || role.permissions.length === 0) {
        return false
      }
      if (!Array.isArray(permissions)) {
        return false
      }
      const myroles = info ? info.roleList : undefined
      if (!Array.isArray(myroles) || myroles.length === 0) {
        return false
      }
      for (let i in permissions) {
        let index = myroles.permissions.findIndex(v => v.value === permissions[i])
        if (index !== -1) {
          return true
        }
      }
      return false
    },
    isKSPermission,
    isLogon () {
      return !!info
    },
    isKSManager (ksid) {
      if (!ksid) return false
      return this.hasAnyPermission([Permissions.科室角色管理权限, Permissions.科级审核], ksid)
    },
    isKJSHManager (ksid) {
      if (!ksid) return false
      return this.hasAnyPermission([Permissions.科级审核], ksid)
    },
    isYJSHManager () {
      return this.hasAnyPermission([Permissions.院级审核])
    }
  }
  if (info) {
    return { ...tmp, ...info }
  } else {
    return tmp
  }
}
