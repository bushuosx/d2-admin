<template>
  <d2-container>
    <el-card v-loading="loading">
      <h3>查看人员角色</h3>
      <el-table :data="ryRolelist">
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span>{{scope.row.role.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限">
          <template slot-scope="scope">
            <span>{{pmssToString(scope.row.role.permissions)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="限定科室">
          <template slot-scope="scope">
            <span>{{scope.row.ks ? scope.row.ks.mc : ""}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </d2-container>
</template>

<script>
import ryroleapi from '@/api/yljs/ryrole'
export default {
  name: 'yljs-ryrole-index',
  props: {
    ryid: String
  },
  data () {
    return {
      loading: false,
      ryRolelist: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.ryRolelist = []
      ryroleapi.getrolesofry(this.ryid).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ryRolelist = res.data
        } else if (res.code === 2) {
          this.$message.warning(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    pmssToString (permissions) {
      let rst = []
      for (let i in permissions) {
        rst.push(permissions[i].name)
      }
      return rst.join()
    }
  }
}
</script>
