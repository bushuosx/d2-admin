<template>
  <div>
    <div style="margin: 10px 0px;width:60%;">
      <el-input v-model="name"
                placeholder="请输入要搜索的内容"
                class="input-with-select">
        <el-select v-model="selected"
                   slot="prepend"
                   placeholder="请选择">
          <el-option label="按姓名搜索"
                     value="xm"></el-option>
          <el-option label="精确搜索工号"
                     value="gh"></el-option>
        </el-select>
        <el-button @click="getuser"
                   slot="append"
                   icon="el-icon-search"
                   type="primary">查询</el-button>
      </el-input>
    </div>

    <el-table :data="rylist"
              style="width: 100%">
      <el-table-column label="科室">
        <template slot-scope="scope">
          <template v-if="scope.row.ryks && scope.row.ryks.ks">
            <router-link :to="{name:'yljs-ks-index',params:{ksid:scope.row.ryks.ks.id}}">{{scope.row.ryks.ks.mc}}</router-link>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="gh"
                       label="工号">
      </el-table-column>
      <el-table-column prop="xm"
                       label="姓名">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <slot name="actioner"
                :ry="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import ryapi from '@/api/yljs/ry'

export default {
  name: 'yljs-ry-search',
  data () {
    return {
      rylist: [],
      name: null,
      selected: 'xm' }
  },
  methods: {
    getuser () {
      if (!this.name) {
        this.$message.warning('搜索内容不能为空')
        return
      }
      let api
      if (this.selected === 'xm') {
        api = ryapi.getbyname(this.name)
      } else if (this.selected === 'gh') {
        api = ryapi.getbygh(this.name)
      } else {
        return
      }
      api.then(res => {
        if (res.code === 1) {
          this.rylist = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    removerow (row) {
      if (!!row && Array.isArray(this.rylist)) {
        this.rylist = this.rylist.filter(x => {
          return x.id !== row.id
        })
      }
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
