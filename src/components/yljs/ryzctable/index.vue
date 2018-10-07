<template>
  <div v-loading="loading">
    <div class="ryzcdata" v-for="item in ryzclist" v-if="isMe || isValid(item)" :key="item.id" @click="handleRyzcClick(item)">
      <el-row>
        <el-col :span="8">{{formartZcLevel(item.zcLevel)}}</el-col>
        <el-col :span="16">{{item.zylb?item.zylb.mc:""}}</el-col>
      </el-row>
      <el-row>
        <el-col><span>获得时间：</span><span>{{formartDate(item.zcsj)}}</span></el-col>
      </el-row>
      <el-row>
        <el-col><span>资历：</span><span>{{formartNZ(item.zcsj)}}</span></el-col>
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
      <ryzc-detail :ryzc="focusRyzc" @detail-update="handleDetailUpdate" :isKSManager="isKSManager" @detail-cancel="detailVisible=false"></ryzc-detail>
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

      if (!val.profileId) {
        // add
        val.profileId = this.ryInfo.ryProfile.id
        ryzcapi.create(val).then(res => {
          if (res.code === 1) {
            this.updateRyzcList(res.data)
          } else {
            this.$message.error(res.msg)
          }
        }).then(err => {
          this.$message.error(err.message ? err.message : err)
        })
      } else if (val.id) {
        this.updateRyzcList(val)
      }
    },
    handleDetailUpdate (val) {
      this.focusRyzc = val
      this.updateRyzcList(val)
      // this.detailVisible=false
    }
  }
}
</script>

<style>
div.ryzcdata {
  width: 300px;
  border-color: #a5ddff;
  border-style: solid;
  margin: 2px;
  padding: 2px;
  cursor: pointer;
}
div.ryzcdata:hover {
  background-color: #f2faff;
}
</style>
