<template>
  <d2-container v-loading="loading">
    <template>
      <strong slot="header">设置科室管理员</strong>
      <p>设置人员为对应科室并设置为管理员</p>
      <p>此方法适用于人员已完成初始化，但尚未选择科室</p>
    </template>
    <div>
      <ol>
        <li>从Excel导入预览数据，匹配要导入的数据</li>
        <li>执行上传工作</li>
        <li>等待服务器返回操作结果</li>
      </ol>
    </div>
    <div>注意：如果人员还未在本系统初始化，则该人员的设置不会成功。可在人员初始化以后，再次进行此操作。</div>
    <import-excel ref="iexcel" @header-change="handleHeaderChange"></import-excel>
    <div>
      <div>在上述数据中选择匹配的列</div>
      <el-form label-width="100px">
        <el-form-item label="工号">
          <el-select v-model="ghHeader">
            <el-option v-for="(row,rowIndex) in headers" :key="rowIndex" :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室编码">
          <el-select v-model="ksHeader">
            <el-option v-for="(row,rowIndex) in headers" :key="rowIndex" :value="row"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存设置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'
export default {
  name: 'yljs-manage-ry-setksmanager',
  components: {
    'import-excel': () => import('@/components/ImportExcel')
  },
  data () {
    return {
      headers: [],
      ghHeader: null,
      ksHeader: null,
      loading: false
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

      if (!this.ghHeader || !this.ksHeader) {
        this.$message.error('数据选取有误')
        return false
      }

      let sd = this.$refs.iexcel.getSelectedData()
      if (!sd || !Array.isArray(sd)) {
        this.$message.error('数据选取有误')
        return false
      }

      const ghHeader = this.ghHeader
      const ksHeader = this.ksHeader

      let rst = sd.map(v => { return { RYGH: v[ghHeader], KSCode: v[ksHeader] } })

      this.loading = true
      ryapi.setksmanager(rst).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.$message.success('操作成功')
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
