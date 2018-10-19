<template>
  <div v-loading="loading">
    <div class="ryxldata" v-for="item in ryxllist" v-if="isMe || isValid(item)" :key="item.id" @click="handleRyxlClick(item)">
      <el-row>
        <el-col :span="8"><span>执业资格专业：</span></el-col>
        <el-col :span="14"><span>{{item.zylb?item.zylb.mc:""}}</span></el-col>
        <el-col :span="2">
          <i v-if="approved(item)" class="el-icon-success" style="color:#67C23A"></i>
          <i v-else-if="rejected(item)" class="el-icon-error" style="color:#F56C6C"></i>
          <i v-else-if="needAction(item)" class="el-icon-warning" style="color:#E6A23C"></i>
          <i v-else class="el-icon-question"></i>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span>获得时间：</span></el-col>
        <el-col :span="16"><span>{{formartDate(item.xlsj)}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span>年资：</span></el-col>
        <el-col :span="16"><span>{{formartNZ(item.xlsj)}}</span></el-col>
      </el-row>
    </div>
    <div class="ryxldata" v-if="!hasData">
      <div>暂无数据</div>
    </div>
    <div v-if="isMe">
      <el-button @click="handleAdd">添加</el-button>
    </div>
    <el-dialog :visible.sync="addVisible" title="添加人员执业资格证明">
      <ryxl-edit :zylblist="zylblist" @edit-save="handleEditSaveFromAdd" @edit-cancel="addVisible=false"></ryxl-edit>
    </el-dialog>
    <el-dialog :visible.sync="detailVisible" title="人员执业资格详细">
      <ryxl-detail :ryxl="focusRyxl" @detail-update="handleDetailUpdate" @detail-edit="handleDetailEdit" :isKSManager="isKSManager" @detail-cancel="detailVisible=false"></ryxl-detail>
    </el-dialog>
    <el-dialog :visible.sync="editVisible" title="修改人员执业资格证明">
      <ryxl-edit :ryxl="focusRyxl" :zylblist="zylblist" @edit-save="handleEditSaveFromEdit" @edit-cancel="editVisible=false"></ryxl-edit>
    </el-dialog>
  </div>
</template>

<script>
import helper from '../helper/index.js'
import user from '@/libs/util.user.js'
import ryxlapi from '@/api/yljs/ryxl'
export default {
  props: {
    ryInfo: {
      type: Object
    }
  },
  data () {
    return {
      detailVisible: false,
      focusRyxl: null,
      addVisible: false,
      editVisible: false,
      ryxllist: [],
      loading: false
    }
  },
  components: {
    'ryxl-detail': () => import('../ryxldetail'),
    'ryxl-edit': () => import('../ryxledit')
  },
  computed: {
    hasData () {
      return Array.isArray(this.ryxllist) && this.ryxllist.length > 0
    },
    isMe () {
      return !!this.ryInfo && this.ryInfo.id === user.userId
    },
    isKSManager () {
      return !!this.ryInfo && !!this.ryInfo.ryks && !!this.ryInfo.ryks.ks && this.ryInfo.ryks.ks.id === user.ksid
    }
  },
  created () {
    this.fetchRyxlList(this.ryInfo)
  },
  watch: {
    ryInfo: function (n, o) { this.fetchRyxlList(n) }
  },
  methods: {
    ...helper,
    fetchRyxlList (ry) {
      this.detailVisible = false
      this.focusRyxl = null
      this.addVisible = false
      this.editVisible = false
      this.zylblist = []
      this.ryxllist = []
      this.loading = false
      if (ry && ry.ryProfile && ry.ryProfile.id) {
        ryxlapi.getbyprofile(ry.ryProfile.id).then(res => {
          if (res.code === 1) {
            this.ryxllist = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    isValid (item) {
      return !!item && !!item.kjshInfo && item.kjshInfo.operateCode === 2
    },
    handleRyxlClick (tmp) {
      if (tmp && tmp.id) {
        if (!tmp.zylb || !tmp.files) {
          this.loading = true
          ryxlapi.get(tmp.id).then(res => {
            this.loading = false
            if (res.code === 1) {
              this.focusRyxl = res.data
              this.updateRyxlList(res.data)
              this.detailVisible = true
            } else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            this.loading = false
            this.$message.error(err.message ? err.message : err)
          })
        } else {
          this.focusRyxl = tmp
          this.detailVisible = true
        }
      }
    },
    updateRyxlList (val) {
      if (val) {
        let index = -1
        for (let i in this.ryxllist) {
          if (this.ryxllist[i].id === val.id) {
            index = i
            break
          }
        }
        if (index === -1) {
          this.ryxllist.push(val)
        } else {
          this.$set(this.ryxllist, index, val)
        }
      }
    },
    handleAdd () {
      // this.fetchZylbList()
      this.addVisible = true
    },
    handleEditSaveFromAdd (val) {
      this.addVisible = false
      this.loading = true
      if (!val.profileId) {
        // add
        val.profileId = this.ryInfo.ryProfile.id
        ryxlapi.create(val).then(res => {
          this.loading = false
          if (res.code === 1) {
            this.updateRyxlList(res.data)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err.message ? err.message : err)
        })
      } else if (val.id) {
        this.updateRyxlList(val)
      }
    },
    handleEditSaveFromEdit (val) {
      this.editVisible = false
      this.loading = true
      if (val.profileId === this.ryInfo.ryProfile.id) {
        // edit
        ryxlapi.update(val).then(res => {
          this.loading = false
          if (res.code === 1) {
            this.updateRyxlList(res.data)
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
      this.focusRyxl = val
      this.updateRyxlList(val)
      // this.detailVisible=false
    },
    handleDetailEdit () {
      this.detailVisible = false
      // this.fetchZylbList()
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
div.ryxldata {
  width: 400px;
  border-color: #ffe0b2;
  border-style: solid;
  margin: 4px;
  padding: 4px;
  cursor: pointer;
}
div.ryxldata:hover {
  background-color: #fff3e0;
}
div.ryxldata span {
  font-family: "Microsoft YaHei", "Arial", "\9ED1\4F53", "\5B8B\4F53",
    sans-serif;
}
</style>
