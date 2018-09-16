<template>
  <d2-container>
    <div style="margin-top: 15px;width:50%;">
      <el-input v-model="name" placeholder="请输入要搜索的内容" class="input-with-select">
        <el-select v-model="selected" slot="prepend" placeholder="请选择">
          <el-option label="按姓名搜索" value="1"></el-option>
          <el-option label="订单号" value="2"></el-option>
          <el-option label="用户电话" value="3"></el-option>
        </el-select>
        <el-button @click="getuser" slot="append" icon="el-icon-search" type="primary">查询</el-button>
      </el-input>
    </div>

    <el-table :data="rys" style="width: 100%">
      <el-table-column prop="id" label="ID" width="300">
      </el-table-column>
      <el-table-column prop="gh" label="工号" width="180">
      </el-table-column>
      <el-table-column prop="xm" label="姓名">
      </el-table-column>
    </el-table>

    <fast-upload></fast-upload>

  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'

// import fastupload from '@/components/fast-upload/index.vue'

export default {
  // components: { fastupload },
  data () {
    return { rys: null, name: null, selected: '1' }
  },
  methods: {
    getuser () {
      if (!this.name || this.name === undefined) {
        this.$message({ message: '搜索内容不能为空', type: 'warning' })
        return
      }
      ryapi.getbyname(this.name).then(function (t) {
        this.rys = t
      })
    }
  }
}
</script>

<style>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
