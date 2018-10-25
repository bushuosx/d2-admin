<template>
  <d2-container v-loading="loading">
    <div style="margin: 10px 0px;width:60%;">
      <el-input v-model="name" placeholder="请输入要搜索的内容" class="input-with-select">
        <el-select v-model="selected" slot="prepend" placeholder="请选择">
          <el-option label="按姓名搜索" value="xm"></el-option>
        </el-select>
        <el-button @click="getuser" slot="append" icon="el-icon-search" type="primary">查询</el-button>
      </el-input>
    </div>

    <el-table :data="rylist" style="width: 100%">
      <el-table-column prop="gh" label="工号">
      </el-table-column>
      <el-table-column prop="xm" label="姓名">
      </el-table-column>
      <el-table-column prop="sfzh" label="身份证">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template v-if="showAction(scope.row)">
            <el-button size="mini" @click="showzl(scope.row)">查看资料</el-button>
            <el-button size="mini" @click="showryjs(scope.row)">查看技术信息</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'

export default {
  name: 'yljs-manage-ry-getemployees',
  data () {
    return {
      rylist: [],
      name: null,
      selected: 'xm',
      loading: false
    }
  },
  methods: {
    getuser () {
      if (!this.name) {
        this.$message.warning('搜索内容不能为空')
        return
      }
      let api
      if (this.selected === 'xm') {
        api = ryapi.getemployees(this.name)
      } else {
        return
      }
      this.loading = true
      api.then(res => {
        this.loading = false
        if (res.code === 1) {
          this.rylist = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => { this.loading = false })
    },
    showAction (row) {
      return !!row && !!row.xm && row.xm.indexOf('未激活') === -1
    },
    showryjs (row) {
      this.$router.push({ name: 'yljs-ryjs-listbyry', params: { ryid: row.id } })
    },
    showzl (row) {
      this.$router.push({ name: 'yljs-ryprofile-index', params: { ryid: row.id } })
    }
  }
}
</script>

<style>
.el-select .el-input {
  width: 140px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
