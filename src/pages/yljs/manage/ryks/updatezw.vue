<template>
  <d2-container v-loading="loading">
    <strong slot="header">设置人员的科室职务</strong>
    <rysearch ref="rysearcher">
      <el-button v-if="isYYRoleManager"
                 type="primary"
                 slot="actioner"
                 slot-scope="scope"
                 @click="updatezw(scope.ry)"
                 size="mini"
                 plain>设置科室职务</el-button>
    </rysearch>

    <el-dialog :visible.sync="editDialogVisible"
               title="设置人员的科室职务">

      <editzw :focusRY="focusRY"
              @edit-save="handleEditSave"
              @edit-cancel="editDialogVisible = false"></editzw>
    </el-dialog>

  </d2-container>
</template>

<script>
import ryksapi from '@/api/yljs/ryks'
import userUtil from '@/libs/util.user.js'

export default {
  name: 'yljs-manage-ryks-updatezy',
  components: {
    'rysearch': () => import('@/components/yljs/rysearch'),
    'editzw': () => import('@/components/yljs/ryks/editrykszw.vue')
  },
  data () {
    return {
      loading: false,
      focusRY: null,
      editDialogVisible: false
    }
  },
  computed: {
    user () {
      return userUtil(this.$store)
    },
    isYYRoleManager () {
      return this.user.hasAnyPermission([this.user.Permissions.医院角色管理权限, this.user.Permissions.网站角色管理权限, this.user.Permissions.超级管理员])
    }
  },
  methods: {
    updatezw (ry) {
      this.focusRY = ry
      this.editDialogVisible = true
    },
    handleEditSave (val) {
      this.loading = true
      ryksapi.updatezw(val).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.$message.success('设置成功')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    }
  }
}
</script>
