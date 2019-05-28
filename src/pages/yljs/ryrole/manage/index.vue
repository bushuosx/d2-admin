<template>
  <d2-container>
    <div slot="header">人员角色分配</div>
    <ry-search v-show="!ryInfo">
      <el-button slot="actioner"
                 slot-scope="scope"
                 @click="handleClick(scope.ry)">分配角色</el-button>
    </ry-search>
    <div v-if="ryInfo"
         v-loading="loading">
      <div>当前操作对象为:{{ryInfo.xm}}</div>
      <div>
        <el-button type="warning"
                   @click="ryInfo=null"
                   plain>重置操作对象</el-button>
      </div>

      <el-card>
        <table style="width:100%">
          <caption>角色列表</caption>
          <thead>
            <tr>
              <th>角色名称</th>
              <th>权限</th>
              <th>限定科室</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row,rownum) in ryrolelist"
                v-bind:key="row.id">
              <td>{{row.role.name}}</td>
              <td>
                <span v-for="(pm,index) in row.role.permissions"
                      v-bind:key="index">{{pm.name}},</span>
              </td>
              <td>{{row.ks ? row.ks.mc : ''}}</td>
              <td>
                <el-button type="danger"
                           icon="el-icon-close"
                           :disabled="!canManageRole(row)"
                           @click="deleteRYRole(rownum)"></el-button>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:10px">
          <div>
            <el-select v-model="edittingroleid"
                       placeholder="请选择一个角色">
              <el-option v-for="role in allrolelist"
                         :key="role.id"
                         :value="role.id"
                         :label="role.name"></el-option>
            </el-select>
            <el-select v-if="musthaveks"
                       v-model="edittingksid"
                       placeholder="限定一个科室">
              <el-option v-for="ks in allkslist"
                         :key="ks.id"
                         :value="ks.id"
                         :label="ks.mc"></el-option>
            </el-select>
            <el-button type="primary"
                       plain
                       @click="addRYRole"
                       :disabled="!canAddRole">添加</el-button>
          </div>
          <el-button @click="saveroles"
                     type="primary">保存</el-button>
        </div>
      </el-card>
    </div>

  </d2-container>
</template>

<script>
import ryroleapi from '@/api/yljs/ryrole'
import ksapi from '@/api/yljs/ks'
import userUtil from '@/libs/util.user.js'
export default {
  name: 'yljs-ryrole-manage',
  components: {
    'ry-search': () => import('@/components/yljs/rysearch')
  },
  data () {
    return {
      ryrolelist: [],
      allrolelist: [],
      allkslist: [],
      edittingroleid: null,
      edittingksid: null,
      ryInfo: null,
      loading: false
    }
  },
  computed: {
    user () {
      return userUtil(this.$store)
    },
    musthaveks () {
      if (!this.edittingroleid) {
        return false
      }
      let role = this.allrolelist.find(v => v.id === this.edittingroleid)
      if (!role) {
        return false
      }
      if (!Array.isArray(role.permissions) || role.permissions.length === 0) {
        return false
      }
      let user = this.user
      let f = role.permissions.findIndex(v => user.isKSPermission(v.value))
      return f !== -1
    },
    canAddRole () {
      // debugger
      if (!this.edittingroleid || (this.musthaveks && !this.edittingksid)) {
        return false
      }
      if (!this.user || !this.user.hasAnyGLPermission()) {
        return false
      }
      // 检测是否已经存在
      let i = this.ryrolelist.findIndex(v => v.role.id === this.edittingroleid && (!this.ks || this.ks.id === this.edittingksid))
      if (i !== -1) {
        return false
      }
      // let role = this.allrolelist.find(v => v.id === this.edittingroleid)
      // if (!role || !this.user.hasAnyPermission(role.permissions.map(v => v.value), null,true)) {
      //   return false
      // }
      return true
    }
  },
  created () {
    this.fetchKS()
  },
  methods: {
    fetchKS () {
      let yjgl = this.user.hasYJGLPermission()
      if (yjgl) {
        this.loading = true
        ksapi.getallks().then(res => {
          this.loading = false
          if (res.code !== 1) {
            this.$message.error(res.msg)
          } else {
            this.allkslist = res.data
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        let rst = []
        for (let i in this.user.roleList) {
          let role = this.user.roleList[i]
          if (!role || !Array.isArray(role.permissions) || !role.ks) {
            continue
          } else {
            let index = role.permissions.findIndex(v => this.user.isKSPermission(v.value))
            if (index !== -1) {
              rst.push(role.ks)
            }
          }
        }
        this.allkslist = rst
      }
    },
    fetchRyRoleData (ryid) {
      this.loading = true
      this.ryrolelist = []
      this.allrolelist = []
      let allroles = null
      Promise.all([ryroleapi.getrolesofry(ryid), ryroleapi.getmyallowedroles()])
        .then(values => {
          this.loading = false
          if (values[0].code !== 1) {
            this.$message.error(values[0].msg)
          } else {
            this.ryrolelist = values[0].data
          }

          if (values[1].code !== 1) {
            this.$message.error(values[1].msg)
            return
          } else {
            allroles = values[1].data
          }
          function rolehasanyp (r, ps) {
            for (let i in ps) {
              if (r.permissions.findIndex(v => v.value === ps[i]) !== -1) {
                return true
              }
            }
            return false
          }
          let rst = []
          let user = this.user
          if (this.user.hasAnyPermission([this.user.Permissions.超级管理权限])) {
            this.allrolelist = allroles
            return
          } else if (this.user.hasAnyPermission([this.user.Permissions.网站角色管理权限])) {
            for (let i in allroles) {
              if (!rolehasanyp(allroles[i], [this.user.Permissions.超级管理权限, this.user.Permissions.网站角色管理权限])) {
                rst.push(allroles[i])
              }
            }
          } else if (this.user.hasAnyPermission([this.user.Permissions.医院角色管理权限])) {
            for (let i in allroles) {
              if (!rolehasanyp(allroles[i], [this.user.Permissions.超级管理权限, this.user.Permissions.网站角色管理权限, this.user.Permissions.医院角色管理权限])) {
                rst.push(allroles[i])
              }
            }
          } else if (this.user.hasAnyPermission([this.user.Permissions.科室角色管理权限], null, true)) {
            for (let i in allroles) {
              if (!rolehasanyp(allroles[i], [this.user.Permissions.超级管理权限, this.user.Permissions.网站角色管理权限, this.user.Permissions.医院角色管理权限, this.user.Permissions.科室角色管理权限])) {
                if (allroles[i].permissions.findIndex(v => user.isKSPermission(v.value)) !== -1) {
                  rst.push(allroles[i])
                }
              }
            }
          }
          this.allrolelist = rst
        }).catch((err) => {
          this.loading = false
          this.$message.error(err.message ? err.message : err)
        })
    },
    canManageRole (ryrole) {
      if (this.user.hasAnyPermission([this.user.Permissions.超级管理权限])) {
        return true
      } else if (this.user.hasAnyPermission([this.user.Permissions.网站角色管理权限])) {
        return !this.user.roleHasAnyPermission(ryrole.role, [this.user.Permissions.网站角色管理权限, this.user.Permissions.超级管理权限])
      } else if (this.user.hasAnyPermission([this.user.Permissions.医院角色管理权限])) {
        return !this.user.roleHasAnyPermission(ryrole.role, [this.user.Permissions.医院角色管理权限, this.user.Permissions.网站角色管理权限, this.user.Permissions.超级管理权限])
      } else {
        return false
      }
    },
    addRYRole () {
      let role = this.allrolelist.find(v => v.id === this.edittingroleid)
      if (!role) {
        this.$message.error('未找到角色')
        return
      }
      let ks
      if (this.musthaveks) {
        ks = this.allkslist.find(v => v.id === this.edittingksid)
        if (!ks) {
          this.$message.error('未找到科室')
          return
        }
      }
      this.ryrolelist.push({ role, ks })
    },
    deleteRYRole (index) {
      this.ryrolelist.splice(index, 1)
    },
    saveroles () {
      if (!Array.isArray(this.ryrolelist)) {
        return
      }
      ryroleapi.updaterolesofry(this.ryInfo.id, this.ryrolelist).then(
        res => {
          if (res.code !== 1) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('角色修改成功')
          }
        }
      )
    },
    handleClick (ry) {
      this.ryInfo = ry
      this.fetchRyRoleData(ry.id)
    }
  }
}
</script>

<style>
.el-select .el-input {
  width: 180px;
}
</style>
