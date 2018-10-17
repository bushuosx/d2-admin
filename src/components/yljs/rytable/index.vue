<template>
    <div>
        <div v-if="ryList">共 {{ryList.length}} 人</div>
        <el-table :data="ryList">
            <el-table-column prop="gh" label="工号"></el-table-column>
            <el-table-column prop="xm" label="姓名"></el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <slot name="actioner" :ry="scope.row"></slot>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  props: {
    ryList: Array
  }
}
</script>
