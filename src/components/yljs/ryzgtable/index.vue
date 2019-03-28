<template>
  <div v-loading="loading">
    <div class="ryzgdata"
         v-if="!hasData">
      <div>暂无数据</div>
    </div>
    <div v-else
         class="ryzgdata"
         v-for="item in ryzglist"
         :key="item.id"
         @click="handleRyzgClick(item)">
      <template v-if="isMe || isKSManager || isValid(item)">
        <el-row>
          <el-col :span="8"><span>资格专业：</span></el-col>
          <el-col :span="14"><strong style="color:#409EFF">{{formartZYLB(item.zylb)}}</strong></el-col>
          <el-col :span="2">
            <i v-if="approved(item)"
               class="el-icon-success"
               style="color:#67C23A"></i>
            <i v-else-if="rejected(item)"
               class="el-icon-error"
               style="color:#F56C6C"></i>
            <i v-else-if="needCommit(item)"
               class="el-icon-warning"
               style="color:#E6A23C"></i>
            <i v-else
               class="el-icon-question"></i>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><span>获得时间：</span></el-col>
          <el-col :span="16"><span>{{formartDate(item.zgsj)}}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><span>年资：</span></el-col>
          <el-col :span="16"><span>{{formartNZ(item.zgsj)}}</span></el-col>
        </el-row>
      </template>
    </div>

    <div v-if="isMe">
      <el-button @click="handleAdd">添加</el-button>
    </div>
    <el-dialog :visible.sync="addVisible"
      title="添加人员执业资格证明">
      <ryzg-edit :zylblist="zylblist"
        @edit-save="handleEditSaveFromAdd"
        @edit-cancel="addVisible=false"></ryzg-edit>
    </el-dialog>
    <el-dialog :visible.sync="detailVisible"
      title="人员执业资格详细">
      <ryzg-detail :ryzg="focusRyzg"
        @detail-update="handleDetailUpdate"
        @detail-edit="handleDetailEdit"
        :isKSManager="isKSManager"
        @detail-cancel="detailVisible=false"></ryzg-detail>
    </el-dialog>
    <el-dialog :visible.sync="editVisible"
      title="修改人员执业资格证明">
      <ryzg-edit :ryzg="focusRyzg"
        :zylblist="zylblist"
        @edit-save="handleEditSaveFromEdit"
        @edit-cancel="editVisible=false"></ryzg-edit>
    </el-dialog>
  </div>
</template>

<script>
import helper from '../helper/index.js'
import user from '@/libs/util.user.js'
import ryzgapi from '@/api/yljs/ryzg'
import zylbapi from '@/api/yljs/zylb'
export default {
  props: {
    ryInfo: {
      type: Object
    }
  },
  data () {
    return {
      detailVisible: false,
      focusRyzg: null,
      addVisible: false,
      editVisible: false,
      ryzglist: [],
      zylblist: [],
      loading: false
    }
  },
  components: {
    'ryzg-detail': () => import('../ryzgdetail'),
    'ryzg-edit': () => import('../ryzgedit')
  },
  computed: {
    hasData () {
      return Array.isArray(this.ryzglist) && this.ryzglist.length > 0
    },
    isMe () {
      return !!this.ryInfo && this.ryInfo.id === user.userId
    },
    isKSManager () {
      return !!this.ryInfo && !!this.ryInfo.ryks && !!this.ryInfo.ryks.ks && this.ryInfo.ryks.ks.id === user.ksid && user.hasRoles([user.Roles.科级审核])
    }
  },
  created () {
    this.fetchRyzgList(this.ryInfo)
  },
  watch: {
    ryInfo: function (n, o) { this.fetchRyzgList(n) }
  },
  methods: {
    ...helper,
    fetchRyzgList (ry) {
      this.detailVisible = false
      this.focusRyzg = null
      this.addVisible = false
      this.editVisible = false
      this.zylblist = []
      this.ryzglist = []
      this.loading = false
      if (ry && ry.ryProfile && ry.ryProfile.id) {
        ryzgapi.getbyprofile(ry.ryProfile.id).then(res => {
          if (res.code === 1) {
            this.ryzglist = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    fetchZylbList () {
      if (!Array.isArray(this.zylblist) || this.zylblist.length < 1) {
        zylbapi.getall().then(res => {
          if (res.code === 1) {
            this.zylblist = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    isValid (item) {
      return !!item && !!item.kjshInfo && item.kjshInfo.operateCode === 2
    },
    handleRyzgClick (tmp) {
      if (tmp && tmp.id) {
        if (!tmp.zylb || !tmp.files) {
          this.loading = true
          ryzgapi.get(tmp.id).then(res => {
            this.loading = false
            if (res.code === 1) {
              this.focusRyzg = res.data
              this.updateRyzgList(res.data)
              this.detailVisible = true
            } else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            this.loading = false
            this.$message.error(err.message ? err.message : err)
          })
        } else {
          this.focusRyzg = tmp
          this.detailVisible = true
        }
      }
    },
    updateRyzgList (val) {
      if (val) {
        let index = -1
        for (let i in this.ryzglist) {
          if (this.ryzglist[i].id === val.id) {
            index = i
            break
          }
        }
        if (index === -1) {
          this.ryzglist.push(val)
        } else {
          this.$set(this.ryzglist, index, val)
        }
      }
    },
    handleAdd () {
      this.fetchZylbList()
      this.addVisible = true
    },
    handleEditSaveFromAdd (val) {
      this.addVisible = false
      this.loading = true
      if (!val.ryProfileID) {
        // add
        // val.profileId = this.ryInfo.ryProfile.id
        ryzgapi.create(val).then(res => {
          this.loading = false
          if (res.code === 1) {
            this.updateRyzgList(res.data)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err.message ? err.message : err)
        })
      } else if (val.id) {
        this.updateRyzgList(val)
      }
    },
    handleEditSaveFromEdit (val) {
      this.editVisible = false
      this.loading = true
      if (val.ryProfileID === this.ryInfo.ryProfile.id) {
        // edit
        ryzgapi.update(val).then(res => {
          this.loading = false
          if (res.code === 1) {
            this.updateRyzgList(res.data)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err.message ? err.message : err)
        })
      }
    },
    handleDetailUpdate (val) {
      this.focusRyzg = val
      this.updateRyzgList(val)
      // this.detailVisible=false
    },
    handleDetailEdit () {
      this.detailVisible = false
      this.fetchZylbList()
      this.editVisible = true
      // this.$message.warning('暂时没有提供编辑，等待系统完善')
    },
    needCommit (row) {
      return !!row && !!row.kjshInfo && row.kjshInfo.operateCode === 0
    },
    approved (row) {
      return !!row && !!row.kjshInfo && row.kjshInfo.operateCode === 2
    },
    rejected (row) {
      return !!row && !!row.kjshInfo && row.kjshInfo.operateCode === 3
    }
  }
}
</script>

<style>
div.ryzgdata {
  width: 400px;
  border-color: #ffe0b2;
  border-style: solid;
  margin: 4px;
  padding: 4px;
  cursor: pointer;
}
div.ryzgdata:hover {
  background-color: #fff3e0;
}
div.ryzgdata span {
  font-family: "Microsoft YaHei", "Arial", "\9ED1\4F53", "\5B8B\4F53",
    sans-serif;
}
</style>
