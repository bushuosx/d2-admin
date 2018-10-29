<template>
  <d2-container v-loading="loading">
    <div slot="header">
      <strong>导入员工信息</strong>
      <div>本医疗技术数据库中存在的信息记录的员工，方能在本系统成功注册</div>
      <div>可以预设科室、预设科室管理员权限、预设医院管理员权限</div>
      <div>数据量较大时，操作耗时将较长。默认等待 <strong>40</strong> 秒。</div>
    </div>
    <div>
      <ol>
        <li>从Excel导入预览数据，匹配要导入的数据</li>
        <li>执行上传工作</li>
        <li>等待服务器返回操作结果</li>
      </ol>
      <!-- <div><a target="_blank" href="/yljs/employees.xlsx">点击这里可以下载模板</a></div> -->
    </div>
    <import-excel ref="iexcel"
      @header-change="handleHeaderChange"></import-excel>
    <div>
      <div>在上述数据中选择匹配的列</div>
      <div>以下标记*的列，为必选项</div>
      <el-form label-width="200px">
        <el-form-item label="*工号">
          <el-select v-model="ghHeader">
            <el-option v-for="(row,rowIndex) in headers"
              :key="rowIndex"
              :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="*姓名">
          <el-select v-model="xmHeader">
            <el-option v-for="(row,rowIndex) in headers"
              :key="rowIndex"
              :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室编码">
          <el-select v-model="ksCodeHeader">
            <el-option v-for="(row,rowIndex) in headers"
              :key="rowIndex"
              :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预设科室管理员">
          <el-select v-model="ksManagerHeader">
            <el-option v-for="(row,rowIndex) in headers"
              :key="rowIndex"
              :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预设医院管理员">
          <el-select v-model="yyManagerHeader">
            <el-option v-for="(row,rowIndex) in headers"
              :key="rowIndex"
              :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleSubmit">开始上传</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="faildList">
      <div><strong>以下人员没有导入成功,共{{faildList.length}}个</strong></div>
      <span v-for="(item,index) in faildList"
        :key="index">{{item.gh}}；</span>
    </div>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'
export default {
  name: 'yljs-manage-ry-importry',
  components: {
    'import-excel': () => import('@/components/ImportExcel')
  },
  data () {
    return {
      headers: [],
      ghHeader: null,
      xmHeader: null,
      ksCodeHeader: null,
      ksManagerHeader: null,
      yyManagerHeader: null,
      loading: false,
      faildList: null
    }
  },
  methods: {
    handleHeaderChange (val) {
      this.headers = val
    },
    handleSubmit () {
      if (this.loading === true) {
        return
      }

      if (!this.ghHeader || !this.xmHeader) {
        this.$message.error('数据选取有误')
        return false
      }

      let sd = this.$refs.iexcel.getSelectedData()
      if (!sd || !Array.isArray(sd)) {
        this.$message.error('数据选取有误')
        return false
      }

      const ghHeader = this.ghHeader
      const xmHeader = this.xmHeader
      const ksCodeHeader = this.ksCodeHeader
      const ksManagerHeader = this.ksManagerHeader
      const yyManagerHeader = this.yyManagerHeader

      let rst = sd.map(v => {
        return {
          GH: v[ghHeader],
          XM: v[xmHeader],
          KSCode: ksCodeHeader ? v[ksCodeHeader] : null,
          KSManager: ksManagerHeader ? !!v[ksManagerHeader] : false,
          YYManager: yyManagerHeader ? !!v[yyManagerHeader] : false
        }
      })

      this.loading = true
      ryapi.importEmployees(rst).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.$message.success('操作成功')
        } else if (res.code === 2) {
          this.$message.warning('部分人员导入失败')
          this.faildList = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message ? err.message : err)
      })
    }
  }
}
</script>
