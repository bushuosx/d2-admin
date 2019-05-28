<template>
  <div>
    <el-table :data="ryjslist"
              :row-class-name="tableRowClassName"
              @selection-change="handleSelectionChange"
              style="width: 100%">
      <el-table-column type="selection"
                       width="55"></el-table-column>
      <template v-if="options && options.showks===true">
        <el-table-column prop="ry.ks.mc"
                         label="科室"></el-table-column>
      </template>
      <template v-if="options && options.showry===true">
        <el-table-column prop="ry.gh"
                         label="工号"></el-table-column>
        <el-table-column prop="ry.xm"
                         label="姓名"></el-table-column>
      </template>
      <el-table-column prop="js.mc"
                       label="技术名称"></el-table-column>
      <el-table-column prop="js.bm"
                       label="编码"></el-table-column>
      <el-table-column prop="js.dj"
                       label="等级"></el-table-column>
      <el-table-column label="限制性技术">
        <template slot-scope="scope">
          <el-tag type="warning"
                  v-if="scope.row.js.limited===true">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核状态"
                       width="180">
        <template slot-scope="scope">
          <template v-if="isBanned(scope.row)">
            <el-button icon="el-icon-delete"
                       disabled
                       size="mini">已禁用</el-button>
          </template>
          <template v-else-if="approved(scope.row)">
            <el-button @click="showDetail(scope.row)"
                       icon="el-icon-success"
                       type="text"
                       size="mini">已审核</el-button>
          </template>
          <template v-else-if="rejected(scope.row)">
            <!-- <el-button v-if="isMe(scope.row)" @click="showEdit(scope.row)" icon="el-icon-error">已驳回</el-button> -->
            <el-button v-if="isMe(scope.row)"
                       @click="showDetail(scope.row)"
                       icon="el-icon-error"
                       size="mini">已驳回</el-button>
            <span v-else><i class="el-icon-error"></i>已驳回</span>
          </template>
          <template v-else-if="needkjsh(scope.row)">
            <el-button v-if="options && options.isKjshManager"
                       @click="handleKjsh(scope.row)"
                       size="mini">科级审核</el-button>
            <el-button v-else-if="isMe(scope.row)"
                       @click="showDetail(scope.row)"
                       icon="el-icon-question"
                       type="text"
                       size="mini">等待科级审核</el-button>
            <span v-else>等待科级审核</span>
          </template>
          <template v-else-if="needyjsh(scope.row)">
            <el-button v-if="options && options.isYjshManager"
                       @click="handleYjsh(scope.row)"
                       size="mini"><strong>院级</strong>审核</el-button>
            <el-button v-else-if="isMe(scope.row)"
                       @click="showDetail(scope.row)"
                       icon="el-icon-question"
                       type="text"
                       size="mini">等待<strong>院级</strong>审核</el-button>
            <span v-else>等待<strong>院级</strong>审核</span>
          </template>
          <template v-else-if="needcommit(scope.row)">
            <template v-if="isMe(scope.row)">
              <el-button @click="handleCommit(scope.row)"
                         icon="el-icon-upload"
                         size="mini">提交</el-button>
              <el-button @click="showEdit(scope.row)"
                         icon="el-icon-edit"
                         size="mini">编辑</el-button>
            </template>
            <span v-else>待提交</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-loading="loading"
               title="查看详细"
               :visible.sync="detailVisible"
               width="80%">
      <ryjs-detail :ryjs="focusRyjs">
        <span slot="footer"
              class="dialog-footer"
              slot-scope="scope">
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button v-if="rejected(scope.data) && isMe(scope.data)"
                     @click="handleReedit"
                     icon="el-icon-error"
                     type="warning"
                     plain>申请已被驳回,点击重新编辑</el-button>
        </span>
      </ryjs-detail>
    </el-dialog>
    <el-dialog v-loading="loading"
               title="编辑申请"
               :visible.sync="editVisible"
               width="80%">
      <ryjs-edit :ryjs="focusRyjs"
                 @save-edit="handleSaveEdit"
                 @delete-edit="handleDeleteEdit"
                 @cancel-edit="handleCancelEdit"></ryjs-edit>
    </el-dialog>
    <el-dialog v-loading="loading"
               title="科级审核"
               :visible.sync="kjshVisible"
               width="80%">
      <ryjs-detail :ryjs="focusRyjs"></ryjs-detail>
      <span slot="footer"
            class="dialog-footer">
        <el-input v-model="reason"
                  placeholder="请输入审核结果的说明"><span slot="prepend">审核理由：</span></el-input>
        <el-button type="warning"
                   @click="rejectKjsh">驳回申请</el-button>
        <el-button type="primary"
                   @click="approveKjsh">审核通过</el-button>
      </span>
    </el-dialog>
    <el-dialog v-loading="loading"
               title="院级审核"
               :visible.sync="yjshVisible"
               width="80%">
      <ryjs-detail :ryjs="focusRyjs"></ryjs-detail>
      <span slot="footer"
            class="dialog-footer">
        <el-input v-model="reason"
                  placeholder="请输入审核结果的说明"><span slot="prepend">审核理由：</span></el-input>
        <el-button type="warning"
                   @click="rejectYjsh">驳回申请</el-button>
        <el-button type="primary"
                   @click="approveYjsh">审核通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import router from '@/router/index.js'
import ryjsapi from '@/api/yljs/ryjs'
import userUtil from '@/libs/util.user.js'
export default {
  props: {
    ryjslist: Array,
    options: {
      type: Object,
      default: function () {
        return {
          showry: true,
          isKjshManager: false,
          ksid: null
        }
      }
    }
  },
  components: {
    'ryjs-detail': () => import('../ryjsdetail'),
    'ryjs-edit': () => import('../ryjsedit')
  },
  data () {
    return {
      focusRyjs: null,
      kjshVisible: false,
      yjshVisible: false,
      detailVisible: false,
      editVisible: false,
      reason: null,
      loading: false
    }
  },
  computed: {
    user () {
      return userUtil(this.$store)
    }
  },
  methods: {
    isBanned (row) {
      return row.banned === true
    },
    showDetail (row) {
      this.focusRyjs = row
      this.detailVisible = true
    },
    isMe (row) {
      if (!row.ry) {
        return false
      }
      return row.ry.id === this.user.id
    },
    handleReedit () {
      // 先要求重新编辑
      ryjsapi.reedit([this.focusRyjs.id]).then(res => {
        this.emitRyjsChange(this.focusRyjs.id, res)
      }).catch(err => {
        this.emitRyjsChange(this.focusRyjs.id, { code: 3, msg: err.message })
      })
      // 启动编辑
    },
    handleCommit (row) {
      ryjsapi.commit([row.id]).then(res => {
        this.emitRyjsChange(row.id, res)
      }).catch(err => {
        this.emitRyjsChange(row.id, { code: 3, msg: err.message })
      })
    },
    showEdit (row) {
      this.focusRyjs = row
      this.editVisible = true
    },
    needcommit (row) {
      return row.kjshInfo.operateCode === 0
    },
    needkjsh (row) {
      return row.kjshInfo.operateCode === 1
    },
    // kjshManager (row) {
    //   if (user.hasRoles([user.Roles.超级管理权限])) {
    //     return true
    //   }
    //   if (!row.ry || !row.ry.ks || !row.ry.ks.ksid) {
    //     return false
    //   }
    //   return user.hasRoles([user.Roles.科级审核]) && user.ksid === row.ry.ks.ksid
    // },
    needyjsh (row) {
      return row.kjshInfo.operateCode === 2 && row.yjshInfo.operateCode !== 2 && row.yjshInfo.operateCode !== 3
    },
    approved (row) {
      return row.yjshInfo.operateCode === 2
    },
    rejected (row) {
      return row.kjshInfo.operateCode === 3 || row.yjshInfo.operateCode === 3
    },
    tableRowClassName ({ row, rowIndex }) {
      if (this.approved(row)) {
        return 'success-row'
      } else if (this.rejected(row)) {
        return 'error-row'
      } else {
        return 'warning-row'
      }
    },
    handleKjsh (row) {
      // router.push({ name: 'yljs-ryjs-kjsh', params: { ryksid: row.id } })
      this.focusRyjs = row
      this.reason = null
      this.kjshVisible = true
    },
    handleYjsh (row) {
      // router.push({ name: 'yljs-ryjs-yjsh', params: { ryksid: row.id } })
      this.focusRyjs = row
      this.reason = null
      this.yjshVisible = true
    },
    handleSelectionChange (val) {
      this.$emit('selection-changed', val)
    },
    approveKjsh () {
      this.loading = true
      let rst = null
      ryjsapi.approveKjsh(this.options.ksid, [this.focusRyjs.id], this.reason).then(res => {
        rst = res
        this.emitRyjsChange(this.focusRyjs.id, rst)
      }).catch(err => {
        rst = { code: 3, msg: err.message }
        this.emitRyjsChange(this.focusRyjs.id, rst)
      })
    },
    rejectKjsh () {
      this.loading = true
      let rst = null
      ryjsapi.rejectKjsh(this.options.ksid, [this.focusRyjs.id], this.reason).then(res => {
        rst = res
        this.emitRyjsChange(this.focusRyjs.id, rst)
      }).catch(err => {
        rst = { code: 3, msg: err.message }
        this.emitRyjsChange(this.focusRyjs.id, rst)
      })
    },
    rejectYjsh () {
      this.loading = true
      let rst = null
      ryjsapi.rejectYjsh([this.focusRyjs.id], this.reason).then(res => {
        rst = res
        this.emitRyjsChange(this.focusRyjs.id, rst)
      }).catch(err => {
        rst = { code: 3, msg: err.message }
        this.emitRyjsChange(this.focusRyjs.id, rst)
      })
    },
    approveYjsh () {
      this.loading = true
      let rst = null
      ryjsapi.approveYjsh([this.focusRyjs.id], this.reason).then(res => {
        rst = res
        this.emitRyjsChange(this.focusRyjs.id, rst)
      }).catch(err => {
        rst = { code: 3, msg: err.message }
        this.emitRyjsChange(this.focusRyjs.id, rst)
      })
    },
    emitRyjsChange (rowid, rst) {
      this.loading = false
      this.$emit('ryjs-changed', rowid, rst)
      this.kjshVisible = false
      this.yjshVisible = false
      this.editVisible = false
      this.detailVisible = false
    },
    handleSaveEdit (rowid, rst) {
      this.$emit('ryjs-changed', rowid, rst)
      this.editVisible = false
    },
    handleCancelEdit (rowid, rst) {
      // this.$emit('ryjs-changed', rowid, rst)
      this.editVisible = false
    },
    handleDeleteEdit (rowid, res) {
      // debugger
      if (res.code === 1) {
        this.$emit('ryjs-deleted', rowid, res.data)
      } else if (res.code === 2) {
        this.$message.warning(res.msg)
      } else {
        this.$messgae.error(res.msg)
      }
      this.editVisible = false
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-table .error-row {
  background: rgb(238, 163, 163);
}
</style>
