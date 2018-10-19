<template>
  <d2-container v-loading="loading">
    <h3 slot="header">人员信息维护</h3>
    <el-card>
      <div>一般信息展示</div>
    </el-card>
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabClick">
      <el-tab-pane name="ryzcTab">
        <span slot="label"><i class="el-icon-star-on"></i>职称</span>
        <ryzc-table v-if="initedTab.ryzcTab" :ryInfo="ryInfo"></ryzc-table>
      </el-tab-pane>
      <el-tab-pane name="ryzgTab">
        <span slot="label"><i class="el-icon-star-on"></i>资格</span>
        <ryzg-table v-if="initedTab.ryzgTab" :ryInfo="ryInfo"></ryzg-table>
      </el-tab-pane>
      <el-tab-pane name="ryxlTab" label="学历">学历</el-tab-pane>
      <el-tab-pane name="ryxwTab" label="学位">学位</el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'
import ryprofileapi from '@/api/yljs/ryprofile'
import user from '@/libs/util.user.js'
export default {
  name: 'yljs-ryprofile-index',
  components: {
    'ryzc-table': () => import('@/components/yljs/ryzctable'),
    'ryzg-table': () => import('@/components/yljs/ryzgtable')
  },
  props: {
    ryid: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      ryInfo: {},
      loading: true,
      activeTabName: null,
      initedTab: {}
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    ryid: function () {
      this.fetchData()
    }
  },
  computed: {
    isMe () {
      return this.ryid === user.userId
    }
  },
  methods: {
    fetchData () {
      let self = this
      self.loading = true
      self.ryInfo = {}
      ryapi.getbyid(self.ryid).then(res => {
        if (res.code === 1) {
          let ryrst = res.data
          if (!ryrst.ryProfile) {
            if (self.isMe) {
              ryprofileapi.getmyprofile().then(rst => {
                if (rst.code === 1) {
                  ryrst.ryProfile = rst.data
                  self.loading = false
                  self.ryInfo = ryrst
                } else {
                  self.loading = false
                  self.$message.error(rst.msg)
                }
              })
            } else {
              self.loading = false
              self.$message.error('该人员还没有填写档案资料')
            }
          } else {
            self.ryInfo = ryrst
            self.loading = false
          }
        } else {
          self.loading = false
          self.$message.error(res.msg)
        }
      }).catch(err => {
        self.loading = false
        self.$message.error(err.message ? err.message : err)
      })
    },
    handleTabClick () {
      this.initedTab[this.activeTabName] = true
    }
    // handelUpdateRyzc (val) {
    //   if (val) {
    //     let index = -1
    //     for (let i in this.ryprofile.ryzCs) {
    //       if (this.ryprofile.ryzCs[i].id === val.id) {
    //         index = i
    //         break
    //       }
    //     }
    //     if (index === -1) {
    //       this.ryprofile.ryzCs.push(val)
    //     } else {
    //       this.$set(this.ryprofile.ryzCs, index, val)
    //     }
    //   }
    // }
  }
}
</script>
