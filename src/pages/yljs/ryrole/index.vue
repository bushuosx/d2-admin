<template>
  <d2-container>
    <el-card v-loading="loading">
      <h3>查看人员角色</h3>
      <el-table :data="rolelist">
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column label="权限">
          <template slot-scope="scope">
            <span>{{pmssToString(scope.row.permissions)}}</span>
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
      loading: true,
      rolelist: []
    }
  },
  created () {
    ryroleapi.getrolesofry(this.ryid).then(res => {
      this.loading = false
      if (res.code === 1) {
        this.rolelist = res.data
      } else if (res.code === 2) {
        this.$message.warning(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    }).catch(() => { this.loading = false })
  },
  methods: {
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
