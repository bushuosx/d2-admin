<template>
    <div>
        <el-table :data="rylist">
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
    rylist: Array
  }
}
</script>
