<template>
    <d2-container>
        <el-button type="primary" @click='getuser'>点击获取</el-button>
        <el-table :data="rys"
                  style="width: 100%">
            <el-table-column prop="id"
                             label="ID"
                             width="300">
            </el-table-column>
            <el-table-column prop="gh"
                             label="工号"
                             width="180">
            </el-table-column>
            <el-table-column prop="xm"
                             label="姓名">
            </el-table-column>
        </el-table>
    </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'

export default {
  data () {
    return { rys: null }
  },
  methods: {
    getuser () {
      ryapi.getbyname('江').then(function (t) { this.rys = t })
    }
  }
}
</script>
