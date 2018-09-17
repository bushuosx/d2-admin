<template>
    <d2-container>
        <div style="margin-top: 15px;width:50%;">
            <el-input v-model="searchvalue" placeholder="请输入要搜索的内容" class="input-with-select">
                <el-select v-model="selected" slot="prepend" placeholder="请选择">
                    <el-option label="按技术名称搜索" value="mc"></el-option>
                </el-select>
                <el-button @click="search" slot="append" icon="el-icon-search" type="primary">查询</el-button>
            </el-input>
        </div>
        <d2-crud :columns="columns" :data="data" :options="options" />
    </d2-container>
</template>

<script>
import ryjsapi from '@/api/yljs/ryjs'
import { Message } from 'element-ui'
export default {
  name: 'yljs-ryjs-list',
  props: { ryid: String },
  data () {
    return {
      searchvalue: null,
      selected: 'mc',
      columns: [
        {
          title: '工号',
          key: 'ry.gh',
          width: '180'
        },
        {
          title: '姓名',
          key: 'ry.xm',
          width: '180'
        },
        {
          title: '技术名称',
          key: 'js.mc'
        },
        {
          title: '技术编码',
          key: 'js.bm',
          width: '180'
        },
        {
          title: '审核状态',
          key: 'yjshinfo.operatecode'
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
  created () {
    // 组件创建完后获取数据，
    // 此时 data 已经被 observed 了
    this.fetchData()
  },
  // watch: {
  //   // 如果路由有变化，会再次执行该方法
  //   '$route': 'fetchData'
  // },
  methods: {
    fetchData () {
      ryjsapi.getbyry(this.ryid).then(
        res => {
          if (res.code === 1) {
            this.data = res.data
          } else {
            Message({ message: res.msg, type: 'error' })
          }
        }
      )
    },
    search () {
      if (!this.searchvalue || this.searchvalue === undefined || this.searchvalue === '') {
        return Message({ message: '请输入搜索内容', type: 'warning' })
      }

      if (this.selected === 'mc') {
        this.data = []
        ryjsapi.getbyryandjs(this.ryid, this.searchvalue).then(
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
  color: #409EFF;
}
</style>
