<template>
  <div>
    <el-table v-if="ksList && ksList.length > 0"
              :data="ksList">
      <el-table-column v-if="showDetail"
                       prop="bm"
                       label="编码">
      </el-table-column>
      <el-table-column label="名称"
                       prop="mc">
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
        <template slot-scope="scope">
          <slot name="actioner"
                :ks="scope.row"></slot>
        </template>
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
