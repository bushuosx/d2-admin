<template>
  <el-form label-width="100px">
    <el-form-item label="科室">
      <strong v-if="focusKS">{{focusKS.mc}}</strong>
    </el-form-item>
    <el-form-item label="科主任">
      <remove-zw v-for="ryks in kzrList"
                 :key="ryks.id"
                 :focusRYKS="ryks"
                 @remove-click="removeZW"></remove-zw>
      <template v-if="!kzrIsFull">
        <add-zw :ryksList="notKzrOrFzrList"
                @add-click="addKZR"></add-zw>
      </template>
    </el-form-item>
    <el-form-item label="副主任">
      <remove-zw v-for="ryks in fzrList"
                 :key="ryks.id"
                 :focusRYKS="ryks"
                 @remove-click="removeZW"></remove-zw>
      <template v-if="!fzrIsFull">
        <add-zw :ryksList="notKzrOrFzrList"
                @add-click="addFZR"></add-zw>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
import ryksapi from '@/api/yljs/ryks'
import userUtil from '@/libs/util.user.js'

export default {
  components: {
    'add-zw': () => import('./addZW'),
    'remove-zw': () => import('./removeZW')
  },
  props: {
    focusKS: Object
  },
  data () {
    return {
      loading: false,
      ryksList: []
    }
  },
  watch: {
    focusKS: {
      immediate: true,
      handler (n) { this.fetchData(n) }
    }
  },
  computed: {
    user () {
      return userUtil(this.$store)
    },
    isYYRoleManager () {
      return this.user.hasAnyPermission([this.user.Permissions.医院角色管理权限, this.user.Permissions.网站角色管理权限, this.user.Permissions.超级管理员])
    },
    kzrList () {
      return this.getRYByZW(20)
    },
    notKzrOrFzrList () {
      return this.ryksList.filter(v => v.zw !== 20 && v.zw !== 21)
    },
    fzrList () {
      return this.getRYByZW(21)
    },
    kzrIsFull () {
      return this.kzrList.length >= 1
    },
    fzrIsFull () {
      return this.fzrList.length >= 2
    }
  },
  methods: {
    async fetchData (ks) {
      if (!ks || this.loading) return

      if (!this.isYYRoleManager) {
        this.$message.error('本页面需要 医院管理员及以上 权限')
      }

      this.loading = true
      this.ryksList = []
      await ryksapi.getrykslistbyks(ks.id).then(res => {
        if (res.code === 1) {
          this.ryksList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      this.loading = false
    },
    getRYByZW (zw) {
      return this.ryksList.filter(v => v.zw === zw)
    },
    async addKZR (ryks) {
      // this.$set(ry, 'zw', 20)
      this.loading = true
      await ryksapi.updatezw({ ryid: ryks.ry.id, ksid: this.focusKS.id, zw: 20 }).then(this.handlerResponse)
      this.loading = false
    },
    async addFZR (ryks) {
      this.loading = true
      await ryksapi.updatezw({ ryid: ryks.ry.id, ksid: this.focusKS.id, zw: 21 }).then(this.handlerResponse)
      this.loading = false
    },
    async removeZW (ryks) {
      this.loading = true
      await ryksapi.updatezw({ ryid: ryks.ry.id, ksid: this.focusKS.id, zw: 0 }).then(this.handlerResponse)
      this.loading = false
    },
    handlerResponse (res) {
      if (res.code === 1) {
        let index = this.ryksList.findIndex(v => v.id === res.data.id)
        if (index !== -1) {
          this.$set(this.ryksList[index], 'zw', res.data.zw)
          this.$message.success('操作成功')
        } else {
          this.$message.error('响应的结果不是预期')
        }
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>
