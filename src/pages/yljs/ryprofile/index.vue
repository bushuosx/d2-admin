<template>
  <d2-container v-loading="loading">
    <el-card>
      <strong slot="header">人员信息</strong>
      <div v-if="!ryInfo">一般信息加载中……</div>
      <template v-else>
        <el-row>
          <el-col :span="8"
            class="el-col-ryinfo">
            <el-row>
              <el-col :span="4"><span>姓名：</span></el-col>
              <el-col :span="8">{{ryInfo.xm}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4"><span>工号：</span></el-col>
              <el-col :span="8">{{ryInfo.gh}}</el-col>
            </el-row>
            <el-row v-if="ryInfo.ryks && ryInfo.ryks.ks">
              <el-col :span="4"><span>科室：</span></el-col>
              <el-col :span="8">{{ryInfo.ryks.ks.mc}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <div>
              <template v-if="ryInfo.ryProfile && ryInfo.ryProfile.photo">
                <div>照片</div>
                <img :style="photoSize"
                  :src="getUrl(ryInfo.ryProfile.photo.id)"
                  alt="正在加载照片">
              </template>
              <el-button v-else-if="isMe"
                @click="photoDialogVisible=true">上传个人照片</el-button>
            </div>
          </el-col>
        </el-row>

      </template>
    </el-card>
    <div v-if="activeTabName ==='0'"><i class="el-icon-caret-bottom"></i>点击以下标签可查看内容<i class="el-icon-caret-bottom"></i></div>
    <el-tabs type="border-card"
      v-model="activeTabName"
      @tab-click="handleTabClick">
      <el-tab-pane name="ryzcTab">
        <span slot="label"><i class="el-icon-star-on"></i>职称</span>
        <ryzc-table v-if="initedTab.ryzcTab"
          :ryInfo="ryInfo"></ryzc-table>
      </el-tab-pane>
      <el-tab-pane name="ryzgTab">
        <span slot="label"><i class="el-icon-star-on"></i>资格</span>
        <ryzg-table v-if="initedTab.ryzgTab"
          :ryInfo="ryInfo"></ryzg-table>
      </el-tab-pane>
      <el-tab-pane name="ryxlTab">
        <span slot="label"><i class="el-icon-star-on"></i>学历</span>
        <ryxl-table v-if="initedTab.ryxlTab"
          :ryInfo="ryInfo"></ryxl-table>
      </el-tab-pane>
      <el-tab-pane name="ryxwTab">
        <span slot="label"><i class="el-icon-star-on"></i>学位</span>
        <ryxw-table v-if="initedTab.ryxwTab"
          :ryInfo="ryInfo"></ryxw-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="photoDialogVisible"
      title="上传个人照片"
      width="80%">
      <image-uploader @Upload-Success="handlePhotoUploadSuccess"></image-uploader>
    </el-dialog>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'
import ryprofileapi from '@/api/yljs/ryprofile'
import user from '@/libs/util.user.js'
import filedownloadapi from '@/api/yljs/filedownload'

export default {
  name: 'yljs-ryprofile-index',
  components: {
    'ryzc-table': () => import('@/components/yljs/ryzctable'),
    'ryzg-table': () => import('@/components/yljs/ryzgtable'),
    'ryxl-table': () => import('@/components/yljs/ryxltable'),
    'ryxw-table': () => import('@/components/yljs/ryxwtable'),
    'image-uploader': () => import('@/components/image-uploader')
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
      initedTab: {},
      photoDialogVisible: false,
      photoData: null, // 临时照片数据
      photoSize: {
        height: 413 / 2 + 'px',
        width: 295 / 2 + 'px'
      }
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
    getUrl: filedownloadapi.getShared,
    fetchData () {
      let self = this
      self.loading = true
      self.ryInfo = {}
      ryapi.getbyid(self.ryid).then(res => {
        if (res.code === 1) {
          let ryrst = res.data
          self.ryInfo = ryrst
          if (!ryrst.ryProfile) {
            if (self.isMe) {
              ryprofileapi.getmyprofile().then(rst => {
                self.loading = false
                if (rst.code === 1) {
                  ryrst.ryProfile = rst.data
                  self.ryInfo = ryrst
                } else {
                  self.$message.error(rst.msg)
                }
              }).catch(() => {
                self.loading = false
              })
            } else {
              self.loading = false
              self.$message.warning('该人员还没有填写档案资料')
            }
          } else {
            // // 加载profile
            // ryprofileapi.getbyry(self.ryid).then(rst => {
            //   self.loading = false
            //   if (rst.code === 1) {
            //     ryrst.ryProfile = rst.data
            //     self.ryInfo = ryrst
            //   } else {
            //     self.$message.error(rst.msg)
            //   }
            // }).catch(() => {
            //   self.loading = false
            // })
            this.loading = false // 不加载具体数据了，放到各档案自行加载
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
    },
    handlePhotoUploadSuccess (fileid, filedata) {
      this.photoDialogVisible = false
      // 更新ryprofile
      this.loading = true
      ryprofileapi.updatePhoto(fileid).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.photoData = filedata
          this.ryInfo.ryProfile.photo = res.data.photo
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    downloadPhoto () {
      if (!this.ryInfo || !this.ryInfo.ryProfile || !this.ryInfo.ryProfile.photo) {
        return false
      }
      filedownloadapi.getFile('shared', this.ryInfo.ryProfile.photo.id).then(res => {
        // console.log(res)

        let fr = new FileReader()
        fr.onload = (ev) => {
          this.photoData = ev.target.result
        }
        fr.readAsDataURL(res.data)
      })
    }
  }
}
</script>

<style>
.el-col-ryinfo .el-row {
  margin: 0.4em;
}
</style>
