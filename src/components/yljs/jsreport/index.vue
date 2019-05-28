<template>
  <el-table :data="jsReport">
    <!-- <el-table-column v-if="showks"
                     label="科室">
      <template v-if="jsReport.ks">
        <span>{{ jsReport.ks.mc }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="showry"
                     label="人员">
      <template v-if="jsReport.ry">
        <span>{{ jsReport.ry.xm }}</span>
      </template>
    </el-table-column> -->
    <el-table-column label="技术名称"
                     prop="js.mc"></el-table-column>
    <el-table-column label="编码"
                     prop="js.bm"></el-table-column>
    <el-table-column label="等级"
                     prop="js.dj"></el-table-column>
    <el-table-column label="限制性技术">
      <template slot-scope="scope">
        <el-tag type="warning"
                v-if="scope.row.js.limited===true">是</el-tag>
      </template>
    </el-table-column>
    <el-table-column v-if="showcount"
                     label="数量">
      <template slot-scope="scope">
        <el-button v-if="scope.row.count"
                   @click="handleClickCount(scope.row)"
                   size="small"
                   type="primary"
                   plain>{{scope.row.count}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    jsReport: {
      type: Array
    },
    showcount: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClickCount (row) {
      if (!!row && !!row.js) {
        this.$emit('click-js', row.js)
      }
    }
  }
}
</script>
