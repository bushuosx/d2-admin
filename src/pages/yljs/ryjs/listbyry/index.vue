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
    <ryjstable :ryjslist="ryjslist" v-on:complite-sh="complitesh"></ryjstable>
  </d2-container>
</template>

<script>
import ryjsapi from '@/api/yljs/ryjs'
import { Message } from 'element-ui'
export default {
  name: 'yljs-ryjs-search',
  props: { ryid: String },
  components: {
    ryjstable: () => import('@/components/yljs/ryjstable')
  },
  data () {
    return {
      searchvalue: null,
      selected: 'mc',
      ryjslist: []
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
            this.ryjslist = res.data
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
              this.ryjslist = res.data
            } else {
              Message({ message: res.msg, type: 'error' })
            }
          }
        )
      } else if (this.selected === 'dj') {

      } else {

      }
    },
    complitesh (rowid, rst) {
      if (rst.code === 1) {
        let index = -1
        for (let i in this.ryjslist) {
          if (rowid === this.ryjslist[i].id) {
            index = i
            break
          }
        }
        if (index !== -1) {
          this.$set(this.ryjslist, index, rst.data[0])
        }
        this.$message.success('审核成功')
      } else {
        this.$message.error(rst.msg)
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
