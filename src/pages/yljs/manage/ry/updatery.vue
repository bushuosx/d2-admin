<template>
  <d2-container>
    <rysearch ref="rysearch"
              :showProfile="true">
      <el-button slot="actioner"
                 slot-scope="scope"
                 @click="handleClick(scope.ry)">编辑</el-button>
    </rysearch>

    <el-dialog :visible.sync="editDialogVisible"
               title="修改人员信息">
      <ry-edit :ry="focusRY"
               @edit-save="handleEditSave"
               @edit-cancel="editDialogVisible=false"></ry-edit>
    </el-dialog>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'
export default {
  name: 'yljs-manage-ry-updatery',
  components: {
    'rysearch': () => import('@/components/yljs/rysearch'),
    'ry-edit': () => import('@/components/yljs/ryedit')
  },
  data () {
    return {
      loading: false,
      editDialogVisible: false,
      focusRY: {}
    }
  },
  methods: {
    handleClick (ry) {
      this.editDialogVisible = true
      this.focusRY = { ...ry, profile: ry.profile === null ? {} : { ...ry.profile } }
    },
    handleEditSave (ry) {
      this.editDialogVisible = false
      let ryList = this.$refs['rysearch'].rylist
      var i = ryList.findIndex(v => v.id === ry.id)
      if (i !== -1) {
        // 启动更新
        this.loading = true
        ryapi.updatery(ry).then(res => {
          this.loading = false
          if (res.code === 1) {
            ryList.splice(i, 1, ry)
            this.$message.success('人员信息修改成功：' + ry.xm)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => { this.loading = false })
      }
    }
  }
}
</script>

<style>
</style>
