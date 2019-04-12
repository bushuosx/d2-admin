<template>
  <d2-container v-loading="loading">
    <strong slot="header">强制将人员退出科室</strong>
    <rysearch ref="rysearcher">
      <el-button v-if="isYYRoleManager"
                 type="danger"
                 slot="actioner"
                 slot-scope="scope"
                 @click="banryks(scope.ry)"
                 size="mini"
                 plain>禁用人员科室</el-button>
    </rysearch>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ryks'
import user from '@/libs/util.user.js'

export default {
  name: 'yljs-manage-ryks-banryks',
  components: {
    'rysearch': () => import('@/components/yljs/rysearch')
  },
  computed: {
    isYYRoleManager () {
      return !!user && user.hasRoles([user.Roles.医院角色管理权限])
    }
  },
  methods: {
    banryks (ry) {
      if (!ry || !ry.id) { return this.$message.error('人员ID不能为空') }
      if (!ry.ryks || !ry.ryks.ks) { return this.$message.error('人员目前没有科室，无需操作') }

      ryapi.banryks(ry.id, ry.ryks.ks.id)
        .then(
          res => {
            if (res.code !== 1) {
              this.$message.error(res.msg)
            } else {
              this.$message.success('禁用科室成功')
              this.$refs.rysearcher.removerow(ry)
            }
          }
        )
        .catch(
          err => {
            this.$message.error(err.message)
          }
        )
    }
  }
}
</script>

<style>
</style>
