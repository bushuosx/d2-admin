<template>
  <div>
    <el-table :data="ksList">
      <el-table-column v-if="showDetail"
                       prop="bm"
                       label="编码">
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)"
                     type="primary"
                     plain>{{scope.row.mc}}</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="showDetail"
                       label="专业">
        <template slot-scope="scope">
          <span v-if="scope.row.zy">{{scope.row.zy.mc}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showDetail"
                       label="类别">
        <template slot-scope="scope">
          <span>{{formartKSType(scope.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showActioner">
        <slot slot-scope="scope"
              name="actioner"
              :ks="scope.row"></slot>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import yljsUtil from '@/libs/util.yljs.js'
export default {
  props: {
    ksList: Array,
    showDetail: Boolean,
    showActioner: Boolean
  },
  methods: {
    formartKSType: yljsUtil.formartKSType
  }
}
</script>
