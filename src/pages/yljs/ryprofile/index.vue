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
            <el-row>
              <el-col :span="4"><span>科室：</span></el-col>
              <el-col :span="8">{{formartKS(ryInfo.ksList)}}</el-col>
            </el-row>
            <template v-if="canShowProfile">
              <el-row v-if="ryInfo.profile">
                <el-col :span="4"><span>岗位：</span></el-col>
                <el-col :span="8">{{formartGW(ryInfo.profile.gw)}}</el-col>
              </el-row>
              <el-row v-if="isMe && canEdit">
                <el-col :span="4">
                  <el-button @click="editDialogVisible=true"
                             type="primary"
                             plain>编辑个人基本信息</el-button>
                </el-col>
              </el-row>
              <el-row v-if="isKSManager && canKJSH">
                <el-col :span="4">
                  <el-button @click="detailDialogVisible=true"
                             type="primary"
                             plain>审核科室人员基本信息</el-button>
                </el-col>
              </el-row>
              <el-row v-if="isMe || (isKJManager && !canKJSH)">
                <el-col :span="4">
                  <el-button @click="detailDialogVisible=true"
                             plain>查看详细</el-button>
                </el-col>
              </el-row>
            </template>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="4">
                <div>照片：</div>
              </el-col>
              <el-col :span="12">
                <template v-if="canShowProfile && ryInfo.profile && ryInfo.profile.photo">
                  <img :style="photoSize"
                       :src="ryInfo.profile.photo.filedata ? ryInfo.profile.photo.filedata : getUrl(ryInfo.profile.photo.id)"
                       alt="正在加载照片">
                </template>
              </el-col>
            </el-row>
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
                    :ryInfo="ryInfo"
                    :activedKsid="ksid"></ryzc-table>
      </el-tab-pane>
      <el-tab-pane name="ryzgTab">
        <span slot="label"><i class="el-icon-star-on"></i>资格</span>
        <ryzg-table v-if="initedTab.ryzgTab"
                    :ryInfo="ryInfo"
                    :activedKsid="ksid"></ryzg-table>
      </el-tab-pane>
      <el-tab-pane name="ryxlTab">
        <span slot="label"><i class="el-icon-star-on"></i>学历</span>
        <ryxl-table v-if="initedTab.ryxlTab"
                    :ryInfo="ryInfo"
                    :activedKsid="ksid"></ryxl-table>
      </el-tab-pane>
      <el-tab-pane name="ryxwTab">
        <span slot="label"><i class="el-icon-star-on"></i>学位</span>
        <ryxw-table v-if="initedTab.ryxwTab"
                    :ryInfo="ryInfo"
                    :activedKsid="ksid"></ryxw-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="editDialogVisible">
      <ryprofile-edit :ry="ryInfo"
                      @edit-cancel="editDialogVisible=false"
                      @edit-save="handleEditSave" />
    </el-dialog>

    <el-dialog :visible.sync="detailDialogVisible">
      <ryprofile-detail :ry="ryInfo"
                        :showKJSH="canKJSH && isKSManager"
                        :canReedit="isApproved && isRYManager"
                        @detail-cancel="detailDialogVisible=false"
                        @detail-approve="handleDetailApprove"
                        @detail-reject="handleDetailReject"
                        @detail-reedit="handleDetailReedit" />
    </el-dialog>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'
import ryprofileapi from '@/api/yljs/ryprofile'
import userUtil from '@/libs/util.user.js'
import yljsUtil from '@/libs/util.yljs.js'
import filedownloadapi from '@/api/yljs/filedownload'

export default {
  name: 'yljs-ryprofile-index',
  components: {
    'ryzc-table': () => import('@/components/yljs/ryzctable'),
    'ryzg-table': () => import('@/components/yljs/ryzgtable'),
    'ryxl-table': () => import('@/components/yljs/ryxltable'),
    'ryxw-table': () => import('@/components/yljs/ryxwtable'),
    'ryprofile-edit': () => import('@/components/yljs/ryprofile/edit'),
    'ryprofile-detail': () => import('@/components/yljs/ryprofile/detail')
  },
  props: {
    ryid: {
      type: String,
      required: true
    },
    ksid: { // 从审核界面传入的ksid
      type: String,
      required: false
    }
  },
  data () {
    return {
      ryInfo: {},
      loading: true,
      activeTabName: null,
      initedTab: {},
      editDialogVisible: false,
      detailDialogVisible: false,
      // photoData: null, // 临时照片数据
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
    user () {
      return userUtil(this.$store)
    },
    isMe () {
      return this.ryid === this.user.id
    },
    isKSManager () {
      return !!this.user && this.user.isKSManager(this.ksid)
    },
    isRYManager () {
      return !!this.user && this.user.hasAnyPermission([this.user.Permissions.人员修改])
    },
    canEdit () {
      return !!this.ryInfo && !!this.ryInfo.profile && !!this.ryInfo.profile.kjshInfo && (this.ryInfo.profile.kjshInfo.operateCode === 0 || this.ryInfo.profile.kjshInfo.operateCode === 3)
    },
    canKJSH () {
      return !!this.ryInfo && !!this.ryInfo.profile && !!this.ryInfo.profile.kjshInfo && this.ryInfo.profile.kjshInfo.operateCode === 1
    },
    isApproved () {
      return !!this.ryInfo && !!this.ryInfo.profile && !!this.ryInfo.profile.kjshInfo && this.ryInfo.profile.kjshInfo.operateCode === 2
    },
    canShowProfile () {
      return !!this.isMe || !!this.isKSManager || !!this.isApproved
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
          if (!ryrst.profile) {
            if (self.isMe) {
              ryprofileapi.getmyprofile().then(rst => {
                self.loading = false
                if (rst.code === 1) {
                  ryrst.profile = rst.data
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
            //     ryrst.profile = rst.data
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
    formartKS (kslist) {
      return yljsUtil.formartKSList(kslist)
    },
    formartGW (gw) {
      return yljsUtil.formartGW(gw)
    },
    handleTabClick () {
      this.initedTab[this.activeTabName] = true
    },
    handleEditSave (val) {
      this.editDialogVisible = false
      // console.log(val)
      // val.profile.kjshInfo.operateCode = 1
      ryprofileapi.update(val.profile).then(res => {
        if (res.code === 1) {
          val.profile.kjshInfo = res.data.kjshInfo
          this.$message.success('修改成功，等待管理员审核')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDetailApprove (val) {
      this.detailDialogVisible = false
      // console.log(val)
      // val.profile.kjshInfo.operateCode = 2
      ryprofileapi.approve(this.ksid, val.profile.id).then(res => {
        if (res.code === 1) {
          val.profile.kjshInfo = res.data.kjshInfo
          this.$message.success('审核成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDetailReject (val) {
      this.detailDialogVisible = false
      // console.log(val)
      // val.profile.kjshInfo.operateCode = 3
      ryprofileapi.reject(this.ksid, val.profile.id).then(res => {
        if (res.code === 1) {
          val.profile.kjshInfo = res.data.kjshInfo
          this.$message.success('驳回成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDetailReedit (val) {
      this.detailDialogVisible = false
      // console.log(val)
      // val.profile.kjshInfo.operateCode = 3
      ryprofileapi.reedit(val.profile.id).then(res => {
        if (res.code === 1) {
          val.profile.kjshInfo = res.data.kjshInfo
          this.$message.success('强制驳回成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    }
    // handlePhotoUploadSuccess (fileid, filedata) {
    //   this.photoDialogVisible = false
    //   // 更新ryprofile
    //   this.loading = true
    //   ryprofileapi.updatePhoto(fileid).then(res => {
    //     this.loading = false
    //     if (res.code === 1) {
    //       this.photoData = filedata
    //       this.ryInfo.profile.photo = res.data.photo
    //     } else {
    //       this.$message.error(res.msg)
    //     }
    //   }).catch(() => {
    //     this.loading = false
    //   })
    // }
    // ,
    // downloadPhoto () {
    //   if (!this.ryInfo || !this.ryInfo.profile || !this.ryInfo.profile.photo) {
    //     return false
    //   }
    //   filedownloadapi.getFile('shared', this.ryInfo.profile.photo.id).then(res => {
    //     // console.log(res)

    //     let fr = new FileReader()
    //     fr.onload = (ev) => {
    //       this.photoData = ev.target.result
    //     }
    //     fr.readAsDataURL(res.data)
    //   })
    // }
  }
}
</script>

<style>
.el-col-ryinfo .el-row {
  margin: 0.4em;
}
</style>
