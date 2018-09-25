<template>
  <d2-container>
    <el-card>
      <div slot="header">人员信息</div>
      <div>
        <span>姓名：{{ryinfo.xm}}</span>
        <span>工号：{{ryinfo.gh}}</span>
      </div>
      <div>科室：
        <span></span>
      </div>
    </el-card>
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
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'
import ryroleapi from '@/api/yljs/ryrole'

export default {
  props: { ryid: String },
  data () {
    return {
      ryinfo: { xm: '', gh: '' },
      rolelist: [],
      selectedrole: []
    }
  },
  created: function () {
    ryapi.getbyid(this.ryid).then(res => {
      if (res.code === 1) {
        this.ryinfo = res.data
      } else {
        this.$message({ message: res.msg, type: 'error' })
      }
    }).catch(() => {
      this.ryinfo = { xm: '', gh: '' }
    })

    Promise.all([ryroleapi.getrolesofry(this.ryid), ryroleapi.getmyallroles()])
      .then(values => {
        if (values[0].code !== 1) {
          this.$message({ message: values[0].msg, type: 'error' })
        } else if (values[1].code !== 1) {
          this.$message({ message: values[1].msg, type: 'error' })
        } else {
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
              if (found !== true) {
                rst.push(newroles[i])
              }
            }
          }

          this.rolelist = rst
        }
      })
  },
  methods: {
    saveroles () {
      console.log('saveroles')
    }
  }
}
</script>
