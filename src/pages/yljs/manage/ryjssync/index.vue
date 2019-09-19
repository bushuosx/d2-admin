<template>
  <d2-container v-loading="loading">
    <h2 slot="header">人员技术HIS同步</h2>
    <el-card>
      <h4 slot="header">审核通过的项目</h4>
      <el-form v-model="approvedInfo">

        <el-form-item label="上一次同步时间">
          <span>{{approvedInfo.lastSyncTime}}</span>
        </el-form-item>
        <el-form-item label="上一次操作人员">
          <span>{{approvedInfo.operator}}</span>
        </el-form-item>
        <el-form-item label="未同步项目数">
          <span>{{approvedInfo.surplus}}</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFetchApproved"
                     :disabled="loading">刷新</el-button>
          <el-button @click="handleUpdateApproved"
                     type="primary"
                     plain
                     :disabled="loading">开始同步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <h4 slot="header">被禁止的项目</h4>
      <el-form v-model="bannedInfo">
        <el-form-item label="上一次同步时间">
          <span>{{bannedInfo.lastSyncTime}}</span>
        </el-form-item>
        <el-form-item label="上一次操作人员">
          <span>{{bannedInfo.operator}}</span>
        </el-form-item>
        <el-form-item label="未同步项目数">
          <span>{{bannedInfo.surplus}}</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFetchBanned"
                     :disabled="loading">刷新</el-button>
          <el-button @click="handleUpdateBanned"
                     type="primary"
                     plain
                     :disabled="loading">开始同步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </d2-container>
</template>

<script>
import ryjssyncapi from '@/api/yljs/ryjssync'

const maxStep = 1000
export default {
  name: 'yljs-manager-ryjssync-index',
  data () {
    return {
      loading: false,
      approvedInfo: {},
      bannedInfo: {}
    }
  },
  methods: {
    fetchSyncInfo (category) {
      return ryjssyncapi.getsyncinfo(category)
    },
    handleFetchApproved () {
      this.fetchSyncInfo(1).then(res => {
        if (res.code === 1) {
          this.$message.success('刷新成功')
          this.approvedInfo = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleUpdateApproved () {
      this.loading = true
      ryjssyncapi.updateapproved(maxStep).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.$message.success('同步成功')
          console.log(res.data)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleFetchBanned () {
      this.fetchSyncInfo(2).then(res => {
        if (res.code === 1) {
          this.$message.success('刷新成功')
          this.bannedInfo = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleUpdateBanned () {
      this.loading = true
      ryjssyncapi.updatebanned(maxStep).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.$message.success('同步成功')
          console.log(res.data)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
