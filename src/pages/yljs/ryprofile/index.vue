<template>
  <d2-container v-loading="loading">
    <h3 slot="header">人员信息维护</h3>
    <el-card>
      <div v-if="!ryInfo">一般信息加载中……</div>
      <template v-else>
        <el-row>
          <el-col :span="8">

            <el-row>
              <el-col :span="4"><span>姓名：</span></el-col>
              <el-col :span="4">{{ryInfo.xm}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4"><span>工号：</span></el-col>
              <el-col :span="4">{{ryInfo.gh}}</el-col>
            </el-row>
            <el-row v-if="ryInfo.ryks && ryInfo.ryks.ks">
              <el-col :span="4"><span>科室：</span></el-col>
              <el-col :span="4">{{ryInfo.ryks.ks.mc}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <div>
              <div>照片：</div>
              <img v-if="ryInfo.ryProfile && ryInfo.ryProfile.photo" :src="getUrl(ryInfo.ryProfile.photo.id)" alt="正在加载照片">
              <el-button v-else-if="isMe" @click="photoDialogVisible=true">上传个人照片</el-button>
            </div>
          </el-col>
        </el-row>

      </template>
    </el-card>
    <div v-if="activeTabName ==='0'"><i class="el-icon-caret-bottom"></i>点击以下标签查看内容<i class="el-icon-caret-bottom"></i></div>
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabClick">
      <el-tab-pane name="ryzcTab">
        <span slot="label"><i class="el-icon-star-on"></i>职称</span>
        <ryzc-table v-if="initedTab.ryzcTab" :ryInfo="ryInfo"></ryzc-table>
      </el-tab-pane>
      <el-tab-pane name="ryzgTab">
        <span slot="label"><i class="el-icon-star-on"></i>资格</span>
        <ryzg-table v-if="initedTab.ryzgTab" :ryInfo="ryInfo"></ryzg-table>
      </el-tab-pane>
      <el-tab-pane name="ryxlTab">
        <span slot="label"><i class="el-icon-star-on"></i>学历</span>
        <ryxl-table v-if="initedTab.ryxlTab" :ryInfo="ryInfo"></ryxl-table>
      </el-tab-pane>
      <el-tab-pane name="ryxwTab">
        <span slot="label"><i class="el-icon-star-on"></i>学位</span>
        <ryxw-table v-if="initedTab.ryxwTab" :ryInfo="ryInfo"></ryxw-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="photoDialogVisible" title="上传个人照片">
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
      photoData: null // 临时照片数据
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
    },
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
