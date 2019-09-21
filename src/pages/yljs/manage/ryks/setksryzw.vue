<template>
  <d2-container v-loading="loading">
    <strong slot="header">设置科室的管理职务</strong>
    <ks-list :ksList="ksList"
             :showActioner="true">
      <el-button slot="actioner"
                 slot-scope="scope"
                 @click="handleClick(scope.ks)">查看并设置</el-button>
    </ks-list>

    <el-dialog :visible.sync="editDialogVisable"
               title="设置职务">
      <editkszw :focusKS="focusKS">
      </editkszw>
    </el-dialog>
  </d2-container>
</template>

<script>
import ksapi from '@/api/yljs/ks'
import userUtil from '@/libs/util.user.js'

export default {
  name: 'yljs-manage-ryks-setksryzw',
  components: {
    'ks-list': () => import('@/components/yljs/kslist'),
    'editkszw': () => import('@/components/yljs/ryks/editkszw.vue')
  },
  data () {
    return {
      loading: false,
      ksList: [],
      focusKS: null,
      editDialogVisable: false
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
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true

      if (!this.isYYRoleManager) {
        this.$message.error('本页面需要 医院管理员及以上 权限')
      }
      await ksapi.getallks().then(res => {
        if (res.code === 1) {
          this.ksList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      this.loading = false
    },
    handleClick (ks) {
      this.focusKS = ks
      this.editDialogVisable = true
    }
  }
}
</script>
