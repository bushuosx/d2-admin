<template>
  <d2-container v-loading="loading">
    <strong slot="header">导入专业类别</strong>
    <div>
      <ol>
        <li>从Excel导入预览数据，匹配要导入的数据</li>
        <li>执行上传工作</li>
        <li>等待服务器返回操作结果</li>
      </ol>
    </div>
    <import-excel ref="iexcel" @header-change="handleHeaderChange"></import-excel>
    <div>
      <div>在上述数据中选择匹配的列</div>
      <div>以下标记*的列，为必选项</div>
      <el-form label-width="100px">
        <el-form-item label="*专业编码">
          <el-select v-model="bmHeader">
            <el-option v-for="(row,rowIndex) in headers" :key="rowIndex" :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="*专业名称">
          <el-select v-model="mcHeader">
            <el-option v-for="(row,rowIndex) in headers" :key="rowIndex" :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-select v-model="smHeader">
            <el-option v-for="(row,rowIndex) in headers" :key="rowIndex" :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存设置</el-button>
        </el-form-item>
      </el-form>
      <div v-if="faildList">
        <div><strong>以下内容没有导入成功,共{{faildList.length}}个</strong></div>
        <span v-for="(item,index) in faildList" :key="index">{{item.gh}}；</span>
      </div>
    </div>
  </d2-container>
</template>

<script>
import zylbapi from '@/api/yljs/zylb'
export default {
  name: 'yljs-manage-zylb-import',
  components: {
    'import-excel': () => import('@/components/ImportExcel')
  },
  data () {
    return {
      headers: [],
      bmHeader: null,
      mcHeader: null,
      smHeader: null,
      loading: false,
      faildList: []
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

      if (!this.bmHeader || !this.mcHeader) {
        this.$message.error('数据选取有误')
        return false
      }

      let sd = this.$refs.iexcel.getSelectedData()
      if (!sd || !Array.isArray(sd)) {
        this.$message.error('数据选取有误')
        return false
      }

      const bmHeader = this.bmHeader
      const mcHeader = this.mcHeader
      const smHeader = this.smHeader

      let rst = sd.map(v => { return { bm: v[bmHeader], mc: v[mcHeader], sm: smHeader ? v[smHeader] : null } })

      this.loading = true
      zylbapi.importzylb(rst).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.$message.success('操作成功')
        } else if (res.code === 2) {
          this.$message.warning(res.msg)
          this.faildList = res.data
        } else {
          this.$message.error(res.msg ? res.msg : '部分操作失败')
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message ? err.message : err)
      })
    }
  }
}
</script>
