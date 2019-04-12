<template>
  <d2-container v-loading="loading">
    <strong slot="header">清空人员照片</strong>
    <rysearch ref="rysearcher">
      <el-button v-if="isYYRoleManager"
                 type="danger"
                 slot="actioner"
                 slot-scope="scope"
                 @click="delryphoto(scope.ry)"
                 size="mini"
                 plain>删除照片</el-button>
    </rysearch>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ryprofile'
import user from '@/libs/util.user.js'

export default {
  name: 'yljs-manage-ry-delryphoto',
  components: {
    'rysearch': () => import('@/components/yljs/rysearch')
  },
  computed: {
    isYYRoleManager () {
      return !!user && user.hasRoles([user.Roles.医院角色管理权限])
    }
  },
  methods: {
    delryphoto (ry) {
      if (!ry || !ry.id) { return '人员ID不能为空' }

      ryapi.delryphoto(ry.id)
        .then(
          res => {
            if (res.code !== 1) {
              this.$message.error(res.msg)
            } else {
              this.$refs.rysearcher.removerow(ry)
              this.$message.success('清除成功')
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
