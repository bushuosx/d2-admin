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
          <span v-else-if="rejected(scope.row)"><i class="el-icon-error"></i>已驳回</span>
          <template v-else-if="needkjsh(scope.row)">
            <el-button v-if="kjshManager(scope.row)" @click="handleKjsh(scope.row)" size="mini">科级审核</el-button>
            <span v-else>等待科级审核</span>
          </template>
          <template v-else-if="needyjsh(scope.row)">
            <el-button v-if="yjshManager(scope.row)" @click="handleYjsh(scope.row)" size="mini"><strong>院级</strong>审核</el-button>
            <span v-else>等待<strong>院级</strong>审核</span>
          </template>
          <span v-else-if="needcommit(scope.row)">待提交</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import router from '@/router/index.js'
import user from '@/libs/util.user.js'
export default {
  props: {
    ryjslist: Array,
    options: Object
  },
  data () {
    return {
      selected: []
    }
  },
  methods: {
    needcommit (row) {
      return row.kjshInfo.operateCode === 0
    },
    needkjsh (row) {
      return row.kjshInfo.operateCode === 1
    },
    kjshManager (row) {
      // return user.hasRoles([user.Roles.科级审核]) && user.ksid === row.ry.ks.ksid
      return user.hasRoles([user.Roles.科级审核])
    },
    needyjsh (row) {
      return row.kjshInfo.operateCode === 2 && row.yjshInfo.operateCode === 1
    },
    yjshManager (row) {
      return user.hasRoles([user.Roles.院级审核])
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
      router.push({ name: 'yljs-ryjs-kjsh', params: { ryksid: row.id } })
    },
    handleYjsh (row) {
      router.push({ name: 'yljs-ryjs-yjsh', params: { ryksid: row.id } })
    },
    handleSelectionChange (val) {
      this.$emit('selection-changed', val)
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
