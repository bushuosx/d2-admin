<template>
    <div>
        <el-table :data="rylist">
            <el-table-column prop="gh" label="工号"></el-table-column>
            <el-table-column prop="xm" label="姓名"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  props: {
    rylist: Array
  }
}
</script>
