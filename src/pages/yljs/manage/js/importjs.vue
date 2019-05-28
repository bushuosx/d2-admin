<template>
  <d2-container v-loading="loading">
    <div slot="header">
      <strong>导入技术信息</strong>
    </div>
    <div>数据量较大时，操作耗时将较长。默认等待 <strong>90</strong> 秒。</div>
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
      <el-form label-width="100px">
        <el-form-item label="*技术名称">
          <el-select v-model="mcHeader">
            <el-option v-for="(row,rowIndex) in headers"
                       :key="rowIndex"
                       :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码">
          <el-select v-model="bmHeader">
            <el-option v-for="(row,rowIndex) in headers"
                       :key="rowIndex"
                       :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="djHeader">
            <el-option v-for="(row,rowIndex) in headers"
                       :key="rowIndex"
                       :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="lbHeader">
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
      <div><strong>以下内容没有导入成功,共{{faildList.length}}个</strong></div>
      <span v-for="(item,index) in faildList"
            :key="index">{{item.mc}}；</span>
    </div>
  </d2-container>
</template>

<script>
import jsapi from '@/api/yljs/js'
export default {
  name: 'yljs-manage-js-importjs',
  components: {
    'import-excel': () => import('@/components/ImportExcel')
  },
  data () {
    return {
      headers: [],
      mcHeader: null,
      bmHeader: null,
      djHeader: null,
      lbHeader: null,
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

      if (!this.mcHeader) {
        this.$message.error('数据选取有误')
        return false
      }

      let sd = this.$refs.iexcel.getSelectedData()
      if (!Array.isArray(sd)) {
        this.$message.error('数据选取有误')
        return false
      }

      const mcHeader = this.mcHeader
      const bmHeader = this.bmHeader
      const djHeader = this.djHeader
      const lbHeader = this.lbHeader

      let rst = sd.map(v => { return { MC: v[mcHeader], BM: bmHeader ? v[bmHeader] : null, DJ: djHeader ? parseInt(v[djHeader]) : 0, LB: lbHeader ? parseInt(v[lbHeader]) : 0 } })

      this.loading = true
      jsapi.importjs(rst).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.$message.success('操作成功')
        } else if (res.code === 2) {
          this.$message.warning('部分内容导入失败')
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
