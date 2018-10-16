<template>
  <d2-container>
    <el-card>
      <h3 slot="header">个人首页</h3>
      <div>
        <span>姓名：{{username}}</span>
        <div><span>科室：XX</span></div>
        <div><a href="/">详细信息</a></div>
      </div>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-card>技术展示</el-card>
        </el-col>
        <el-col :span="8">
          <el-card>年资</el-card>
        </el-col>
        <el-col :span="8">
          <el-card>学历</el-card>
        </el-col>
      </el-row>
    </el-card>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'

// import fastupload from '@/components/fast-upload/index.vue'

export default {
  name: 'yljs-index-ry',
  // components: { fastupload },
  data () {
    return { rys: null, name: null, selected: '1' }
  },
  computed: {
    username () {
      return this.$store.state.d2admin.user.info.name
    }
  },
  methods: {
    getuser () {
      if (!this.name || this.name === undefined) {
        this.$message({ message: '搜索内容不能为空', type: 'warning' })
        return
      }
      ryapi.getbyname(this.name).then(t => {
        if (t.code === 1) {
          this.rys = t.data
        } else {
          this.$message({ message: t.msg, type: 'error' })
        }
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
