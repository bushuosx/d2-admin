<template>
    <div>
        <el-table :data="ryjslist" style="width: 100%">
            <template v-if="options && options.ryinfo">
                <el-table-column label="科室"></el-table-column>
                <el-table-column label="工号"></el-table-column>
                <el-table-column label="姓名"></el-table-column>
            </template>
            <el-table-column label="技术名称"></el-table-column>
            <el-table-column label="编码"></el-table-column>
            <el-table-column label="等级"></el-table-column>
            <el-table-column label="审核状态"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  props: {
    ryjslist: Array,
    options: Object
  }
}
</script>
