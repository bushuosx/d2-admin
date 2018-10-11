<template>
  <div v-loading="loading">
    <div>
      <el-upload :before-upload="handleUpload" action="default">
        <el-button type="success">
          <d2-icon name="file-o" />
          选择要导入的 .xlsx 表格
        </el-button>
      </el-upload>
    </div>
    <div style="height:480px;overflow:auto">
      <table width="100%">
        <caption>{{this.fileName}}</caption>
        <thead v-if="excelData && excelData.header">
          <tr style="text-align:left">
            <th><input type="checkbox" @click="handleCheckAll($event.target.checked)" />行号</th>
            <th v-for="(item,index) in excelData.header" :key="index">{{item}}</th>
          </tr>
        </thead>
        <tbody v-if="excelData && excelData.results">
          <tr v-for="(row,rowIndex) in excelData.results" :key="rowIndex">
            <td><input type="checkbox" :checked="row.checked" @change="handleRowCheckChange($event.target.checked, row)" /><span>{{rowIndex}}</span></td>
            <td v-for="(item,itemKey) in row" v-if="itemKey !== 'checked'" :key="itemKey">{{item}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      excelData: {
        header: null,
        results: null
      },
      fileName: null,
      loading: false
    }
  },
  methods: {
    handleUpload (file) {
      this.fileName = file.name
      this.excelData = {
        header: null,
        results: null
      }
      this.emitHeaderChange()

      this.loading = true
      this.$import.xlsx(file)
        .then(({ header, results }) => {
          this.excelData = { header, results }
          this.loading = false
          this.emitHeaderChange()
        }).catch(() => { this.loading = false })
      return false
    },
    getHeaders () {
      if (!this.excelData || !Array.isArray(this.excelData.header)) {
        return []
      }
      return this.excelData.header
    },
    emitHeaderChange () {
      this.$emit('header-change', this.getHeaders())
    },
    getData (min, max) {
      if (!this.excelData || !Array.isArray(this.excelData.results)) {
        return []
      }
      if (min === null || min === undefined || min < 0) {
        min = 0
      }
      if (max === null || max === undefined || max > this.excelData.results.length) {
        max = this.excelData.results.length
      }
      return this.excelData.results.filter((v, i) => i >= min || i <= max)
    },
    handleRowCheckChange (e, row) {
      row.checked = e
    },
    getSelectedData () {
      if (!this.excelData || !Array.isArray(this.excelData.results)) {
        return []
      }
      return this.excelData.results.filter(v => v.checked === true)
    },
    handleCheckAll (e) {
      if (!this.excelData || !Array.isArray(this.excelData.results)) {
        return false
      }
      this.loading = true
      let tmp = this.excelData.results
      for (let i in tmp) {
        this.$set(tmp[i], 'checked', e)
      }
      this.loading = false
    }
  }
}
</script>
