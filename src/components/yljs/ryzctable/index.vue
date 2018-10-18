<template>
  <div v-loading="loading">
    <div class="ryzcdata" v-for="item in ryzclist" v-if="isMe || isValid(item)" :key="item.id" @click="handleRyzcClick(item)">
      <el-row>
        <el-col :span="8"><span>职称级别：</span></el-col>
        <el-col :span="14"><span><strong v-if="item.zcLevel" style="color:#409EFF">{{formartZcLevel(item.zcLevel)}}</strong></span></el-col>
        <el-col :span="2">
          <i v-if="approved(item)" class="el-icon-success" style="color:#67C23A"></i>
          <i v-else-if="rejected(item)" class="el-icon-error" style="color:#F56C6C"></i>
          <i v-else-if="needAction(item)" class="el-icon-warning" style="color:#E6A23C"></i>
          <i v-else class="el-icon-question"></i>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span>专业：</span></el-col>
        <el-col :span="16"><span>{{item.zylb?item.zylb.mc:""}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span>获得时间：</span></el-col>
        <el-col :span="16"><span>{{formartDate(item.zcsj)}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span>年资：</span></el-col>
        <el-col :span="16"><span>{{formartNZ(item.zcsj)}}</span></el-col>
      </el-row>
    </div>
    <div class="ryzcdata" v-if="!hasData">
      <div>暂无数据</div>
    </div>
    <div v-if="isMe">
      <el-button @click="handleAdd">添加</el-button>
    </div>
    <el-dialog :visible.sync="addVisible" title="添加人员职称证明">
      <ryzc-edit :zylblist="zylblist" @edit-save="handleEditSaveFromAdd" @edit-cancel="addVisible=false"></ryzc-edit>
    </el-dialog>
    <el-dialog :visible.sync="detailVisible" title="人员职称详细">
      <ryzc-detail :ryzc="focusRyzc" @detail-update="handleDetailUpdate" @detail-edit="handleDetailEdit" :isKSManager="isKSManager" @detail-cancel="detailVisible=false"></ryzc-detail>
    </el-dialog>
    <el-dialog :visible.sync="editVisible" title="修改人员职称证明">
      <ryzc-edit :ryzc="focusRyzc" :zylblist="zylblist" @edit-save="handleEditSaveFromEdit" @edit-cancel="editVisible=false"></ryzc-edit>
    </el-dialog>
  </div>
</template>

<script>
import helper from '../helper/index.js'
import user from '@/libs/util.user.js'
import ryzcapi from '@/api/yljs/ryzc'
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
      focusRyzc: null,
      addVisible: false,
      editVisible: false,
      zylblist: [],
      ryzclist: [],
      loading: false
    }
  },
  components: {
    'ryzc-detail': () => import('../ryzcdetail'),
    'ryzc-edit': () => import('../ryzcedit')
  },
  computed: {
    hasData () {
      return Array.isArray(this.ryzclist) && this.ryzclist.length > 0
    },
    isMe () {
      return !!this.ryInfo && this.ryInfo.id === user.userId
    },
    isKSManager () {
      return !!this.ryInfo && !!this.ryInfo.ryks && !!this.ryInfo.ryks.ks && this.ryInfo.ryks.ks.id === user.ksid
    }
  },
  created () {
    this.fetchRyzcList(this.ryInfo)
  },
  watch: {
    ryInfo: function (n, o) { this.fetchRyzcList(n) }
  },
  methods: {
    ...helper,
    fetchRyzcList (ry) {
      this.detailVisible = false
      this.focusRyzc = null
      this.addVisible = false
      this.editVisible = false
      this.zylblist = []
      this.ryzclist = []
      this.loading = false
      if (ry && ry.ryProfile && ry.ryProfile.id) {
        ryzcapi.getbyprofile(ry.ryProfile.id).then(res => {
          if (res.code === 1) {
            this.ryzclist = res.data
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
    handleRyzcClick (tmp) {
      if (tmp && tmp.id) {
        if (!tmp.zylb || !tmp.files) {
          this.loading = true
          ryzcapi.get(tmp.id).then(res => {
            this.loading = false
            if (res.code === 1) {
              this.focusRyzc = res.data
              this.updateRyzcList(res.data)
              this.detailVisible = true
            } else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            this.loading = false
            this.$message.error(err.message ? err.message : err)
          })
        } else {
          this.focusRyzc = tmp
          this.detailVisible = true
        }
      }
    },
    updateRyzcList (val) {
      if (val) {
        let index = -1
        for (let i in this.ryzclist) {
          if (this.ryzclist[i].id === val.id) {
            index = i
            break
          }
        }
        if (index === -1) {
          this.ryzclist.push(val)
        } else {
          this.$set(this.ryzclist, index, val)
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
      if (!val.profileId) {
        // add
        val.profileId = this.ryInfo.ryProfile.id
        ryzcapi.create(val).then(res => {
          this.loading = false
          if (res.code === 1) {
            this.updateRyzcList(res.data)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err.message ? err.message : err)
        })
      } else if (val.id) {
        this.updateRyzcList(val)
      }
    },
    handleEditSaveFromEdit (val) {
      this.editVisible = false
      this.loading = true
      if (val.profileId === this.ryInfo.ryProfile.id) {
        // edit
        ryzcapi.update(val).then(res => {
          this.loading = false
          if (res.code === 1) {
            this.updateRyzcList(res.data)
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
      this.focusRyzc = val
      this.updateRyzcList(val)
      // this.detailVisible=false
    },
    handleDetailEdit () {
      this.detailVisible = false
      this.fetchZylbList()
      this.editVisible = true
      // this.$message.warning('暂时没有提供编辑，等待系统完善')
    },
    needAction (row) {
      return !!row && !!row.kjshInfo && (row.kjshInfo.operateCode === 0 || row.kjshInfo.operateCode === 1)
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
div.ryzcdata {
  width: 400px;
  border-color: #ffe0b2;
  border-style: solid;
  margin: 4px;
  padding: 4px;
  cursor: pointer;
}
div.ryzcdata:hover {
  background-color: #fff3e0;
}
div.ryzcdata span {
  font-family: "Microsoft YaHei", "Arial", "\9ED1\4F53", "\5B8B\4F53",
    sans-serif;
}
</style>
