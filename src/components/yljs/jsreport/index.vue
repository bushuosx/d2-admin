<template>
  <el-table v-if="!!jsReport && jsReport.jsList" :data="jsReport.jsList">
    <el-table-column v-if="showks" label="科室">
      <template v-if="jsReport.ks">
        <span>{{ jsReport.ks.mc }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="showry" label="人员">
      <template v-if="jsReport.ry">
        <span>{{ jsReport.ry.xm }}</span>
      </template>
    </el-table-column>
    <el-table-column label="技术名称" prop="js.mc"></el-table-column>
    <el-table-column label="编码" prop="js.jsbm"></el-table-column>
    <el-table-column label="等级" prop="js.dj"></el-table-column>
    <el-table-column v-if="showcount" label="数量">
      <template slot-scope="scope">
        <el-button v-if="scope.row.count" @click="handleClickCount(scope.row)" size="small" type="primary" plain>{{scope.row.count}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    jsReport: {
      type: Object
    },
    options: {
      type: Object,
      default: function () {
        return {
          showks: false,
          showry: false,
          showcount: false
        }
      }
    }
  },
  computed: {
    showks: function () { return !!this.options && this.options.showks === true },
    showry: function () { return !!this.options && this.options.showry === true },
    showcount: function () { return !!this.options && this.options.showcount === true }
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
