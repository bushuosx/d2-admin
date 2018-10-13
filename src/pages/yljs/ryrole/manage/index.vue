<template>
  <d2-container>
    <div slot="header">人员角色分配</div>
    <ry-search v-show="!ryInfo">
      <el-button slot="actioner" slot-scope="scope" @click="handleClick(scope.ry)">分配角色</el-button>
    </ry-search>
    <div v-if="ryInfo" v-loading="loading">
      <div>当前操作对象为:{{ryInfo.xm}}</div>
      <div>
        <el-button type="warning" @click="ryInfo=null" plain>重置操作对象</el-button>
      </div>

      <el-card>
        <table style="width:100%">
          <caption>角色列表</caption>
          <thead>
            <tr>
              <th></th>
              <th>角色名称</th>
              <th>权限</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in rolelist" v-bind:key="role.id">
              <td><input type="checkbox" v-model="role.checked" v-bind:disabled="role.disabled" /></td>
              <td>{{role.roleName}}</td>
              <td>
                <span v-for="(pm,index) in role.permissions" v-bind:key="index">{{pm.name}},</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:10px">
          <el-button @click="saveroles" type="primary">保存</el-button>
        </div>
      </el-card>
    </div>

  </d2-container>
</template>

<script>
import ryroleapi from '@/api/yljs/ryrole'

export default {
  name: 'yljs-ryrole-manage',
  data () {
    return {
      rolelist: [],
      ryInfo: null,
      loading: false
    }
  },
  components: {
    'ry-search': () => import('@/components/yljs/rysearch')
  },
  methods: {
    fetchRyRoleData (ryid) {
      this.loading = true
      this.rolelist = []
      Promise.all([ryroleapi.getrolesofry(ryid), ryroleapi.getmyallroles()])
        .then(values => {
          this.loading = false
          if (values[1].code !== 1) {
            this.$message.error(values[1].msg)
          } else {
            if (values[0].code !== 1) {
              // 用户尚没有任何角色
              this.rolelist = values[1].data
              return
            }
            let rst = []
            let oldroles = values[0].data
            let newroles = values[1].data
            for (let i in oldroles) {
              let found = false
              for (let j in newroles) {
                if (oldroles[i].id === newroles[j].id) {
                  found = true
                  break
                }
              }

              oldroles[i].checked = true

              if (found !== true) {
                oldroles[i].disabled = true
              }

              rst.push(oldroles[i])
            }

            for (let i in newroles) {
              let found = false
              for (let j in oldroles) {
                if (newroles[i].id === oldroles[j].id) {
                  found = true
                  break
                }
              }
              if (found !== true) {
                rst.push(newroles[i])
              }
            }

            this.rolelist = rst
          }
        }).catch((err) => {
          this.loading = false
          this.$message.error(err.message ? err.message : err)
        })
    },
    saveroles () {
      if (!Array.isArray(this.rolelist)) {
        return
      }
      let roleidlist = []
      for (let i in this.rolelist) {
        if (this.rolelist[i].checked === true) {
          roleidlist.push(this.rolelist[i].id)
        }
      }
      ryroleapi.updaterolesofry(this.ryInfo.id, roleidlist).then(
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
