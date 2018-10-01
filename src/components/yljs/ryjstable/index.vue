<template>
  <div>
    <el-table :data="ryjslist" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <template v-if="options && options.showks===true">
        <el-table-column prop="ry.ks.mc" label="科室"></el-table-column>
      </template>
      <template v-if="options && options.showry===true">
        <el-table-column prop="ry.gh" label="工号"></el-table-column>
        <el-table-column prop="ry.xm" label="姓名"></el-table-column>
      </template>
      <el-table-column prop="js.mc" label="技术名称"></el-table-column>
      <el-table-column prop="js.bm" label="编码"></el-table-column>
      <el-table-column prop="js.dj" label="等级"></el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <span v-if="approved(scope.row)"><i class="el-icon-success"></i>已审核</span>
          <template v-else-if="rejected(scope.row)">
            <el-button v-if="isMe(scope.row)" @click="handleReedit(scope.row)" size="mini">重新编辑</el-button>
            <span v-else><i class="el-icon-error"></i>已驳回</span>
          </template>
          <template v-else-if="needkjsh(scope.row)">
            <el-button v-if="kjshManager(scope.row)" @click="handleKjsh(scope.row)" size="mini">科级审核</el-button>
            <span v-else>等待科级审核</span>
          </template>
          <template v-else-if="needyjsh(scope.row)">
            <el-button v-if="yjshManager(scope.row)" @click="handleYjsh(scope.row)" size="mini"><strong>院级</strong>审核</el-button>
            <span v-else>等待<strong>院级</strong>审核</span>
          </template>
          <template v-else-if="needcommit(scope.row)">
            <el-button v-if="isMe(scope.row)" @click="handleCommit(scope.row)" size="mini">提交申请</el-button>
            <span v-else>待提交</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-loading="loading" title="科级审核" :visible.sync="kjshVisible" width="80%">
      <ryjs-detail :ryjs="focusRyjs"></ryjs-detail>
      <span slot="footer" class="dialog-footer">
        <el-input v-model="reason" placeholder="请输入审核结果的说明"><span slot="prepend">审核理由：</span></el-input>
        <el-button type="warning" @click="rejectKjsh">驳回申请</el-button>
        <el-button type="primary" @click="approveKjsh">审核通过</el-button>
      </span>
    </el-dialog>
    <el-dialog v-loading="loading" title="院级审核" :visible.sync="yjshVisible" width="80%">
      <ryjs-detail :ryjs="focusRyjs"></ryjs-detail>
      <span slot="footer" class="dialog-footer">
        <el-input v-model="reason" placeholder="请输入审核结果的说明"><span slot="prepend">审核理由：</span></el-input>
        <el-button type="warning" @click="rejectYjsh">驳回申请</el-button>
        <el-button type="primary" @click="approveYjsh">审核通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import router from '@/router/index.js'
import ryjsapi from '@/api/yljs/ryjs'
import user from '@/libs/util.user.js'
export default {
  props: {
    ryjslist: Array,
    options: {
      type: Object,
      default: function () {
        return { showry: true }
      }
    }
  },
  components: {
    'ryjs-detail': () => import('@/components/yljs/ryjsdetail')
  },
  data () {
    return {
      focusRyjs: null,
      kjshVisible: false,
      yjshVisible: false,
      reason: null,
      loading: false
    }
  },
  methods: {
    isMe (row) {
      if (!row.ry) {
        return false
      }
      return row.ry.id === user.userId
    },
    handleReedit (row) {

    },
    handleCommit (row) {
      ryjsapi.commit(row.id).then(res => {
        this.reportsh(row, res)
      }).catch(err => {
        this.reportsh(row, { code: 3, msg: err.message })
      })
    },
    needcommit (row) {
      return row.kjshInfo.operateCode === 0
    },
    needkjsh (row) {
      return row.kjshInfo.operateCode === 1
    },
    kjshManager (row) {
      if (user.hasRoles([user.Roles.超级管理权限])) {
        return true
      }
      if (!row.ry || !row.ry.ks || !row.ry.ks.ksid) {
        return false
      }
      return user.hasRoles([user.Roles.科级审核]) && user.ksid === row.ry.ks.ksid
    },
    needyjsh (row) {
      return row.kjshInfo.operateCode === 2 && row.yjshInfo.operateCode !== 2 && row.yjshInfo.operateCode !== 3
    },
    yjshManager (row) {
      return user.hasRoles([user.Roles.超级管理权限]) || user.hasRoles([user.Roles.院级审核])
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
      ryjsapi.approveKjsh([this.focusRyjs.id], this.reason).then(res => {
        rst = res
        this.reportsh(this.focusRyjs, rst)
      }).catch(err => {
        rst = { code: 3, msg: err.message }
        this.reportsh(this.focusRyjs, rst)
      })
    },
    rejectKjsh () {
      this.loading = true
      let rst = null
      ryjsapi.rejectKjsh([this.focusRyjs.id], this.reason).then(res => {
        rst = res
        this.reportsh(this.focusRyjs, rst)
      }).catch(err => {
        rst = { code: 3, msg: err.message }
        this.reportsh(this.focusRyjs, rst)
      })
    },
    rejectYjsh () {
      this.loading = true
      let rst = null
      ryjsapi.rejectYjsh([this.focusRyjs.id], this.reason).then(res => {
        rst = res
        this.reportsh(this.focusRyjs, rst)
      }).catch(err => {
        rst = { code: 3, msg: err.message }
        this.reportsh(this.focusRyjs, rst)
      })
    },
    approveYjsh () {
      this.loading = true
      let rst = null
      ryjsapi.approveYjsh([this.focusRyjs.id], this.reason).then(res => {
        rst = res
        this.reportsh(this.focusRyjs, rst)
      }).catch(err => {
        rst = { code: 3, msg: err.message }
        this.reportsh(this.focusRyjs, rst)
      })
    },
    reportsh (row, rst) {
      this.loading = false
      this.$emit('complite-sh', row.id, rst)
      this.kjshVisible = false
      this.yjshVisible = false
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
