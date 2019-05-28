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
          <template v-if="Array.isArray( scope.row.ksList) && scope.row.ksList.length > 0">
            <router-link v-for="(ks,index) in scope.row.ksList"
                         :key="index"
                         :to="{name:'yljs-ks-index',params:{ksid:ks.id}}">{{ks.mc}}</router-link>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="gh"
                       label="工号">
      </el-table-column>
      <el-table-column prop="xm"
                       label="姓名">
      </el-table-column>
      <template v-if="showProfile">
        <el-table-column label="岗位">
          <template slot-scope="scope">
            <span>{{formartGW(scope.row.profile.gw)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span>{{formartXB(scope.row.profile.xb)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号是否禁用">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.banned===true"
                    type="danger">已禁用</el-tag>
          </template>
        </el-table-column>
      </template>
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
import util from '@/libs/util.yljs.js'
export default {
  name: 'yljs-ry-search',
  props: {
    showProfile: Boolean
  },
  data () {
    return {
      rylist: [],
      name: null,
      selected: 'xm' }
  },
  methods: {
    formartGW: util.formartGW,
    formartXB: util.formartXB,
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
