<template>
  <d2-container>
    <div style="margin-top: 15px;width:50%;">
      <el-input v-model="searchvalue" placeholder="请输入要搜索的内容" class="input-with-select">
        <el-select v-model="selected" slot="prepend" placeholder="请选择">
          <el-option label="按技术名称搜索" value="mc"></el-option>
          <el-option label="按编码搜索" value="bm"></el-option>
          <el-option label="按等级搜索" value="dj"></el-option>
        </el-select>
        <el-button @click="search" slot="append" icon="el-icon-search" type="primary">查询</el-button>
      </el-input>
    </div>
    <d2-crud :columns="columns" :data="data" :options="options" />
  </d2-container>
</template>

<script>
import jsapi from '@/api/yljs/js'
import { Message } from 'element-ui'
export default {
  name: 'yljs-js-search',
  data () {
    return {
      searchvalue: null,
      selected: 'mc',
      columns: [
        {
          title: '名称',
          key: 'mc',
          width: '180'
        },
        {
          title: '描述',
          key: 'ms',
          width: '180'
        },
        {
          title: '专业等级',
          key: 'dj'
        },
        {
          title: '编码',
          key: 'jsbm',
          width: '180'
        },
        {
          title: '专业类别',
          key: 'lb'
        }
      ],
      data: [],
      options: {
        rowClassName ({ row, rowIndex }) {
          if (rowIndex === 1) {
            return 'warning-row'
          } else if (rowIndex === 3) {
            return 'success-row'
          }
          return ''
        }
      }
    }
  },
  methods: {
    search () {
      if (!this.searchvalue || this.searchvalue === undefined || this.searchvalue === '') {
        return Message({ message: '请输入搜索内容', type: 'warning' })
      }

      if (this.selected === 'mc') {
        this.data = []
        jsapi.getbyname(this.searchvalue).then(
          res => {
            if (res.code === 1) {
              this.data = res.data
            } else {
              Message({ message: res.msg, type: 'error' })
            }
          }
        )
      } else if (this.selected === 'bm') {
        this.data = []
        jsapi.getbycode(this.searchvalue).then(
          res => {
            if (res.code === 1) {
              this.data = res.data
            } else {
              Message({ message: res.msg, type: 'error' })
            }
          }
        )
      } else if (this.selected === 'dj') {

      } else {

      }
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-select .el-input {
  width: 150px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.input-with-select .el-input-group__append {
  color: #409eff;
}
</style>
