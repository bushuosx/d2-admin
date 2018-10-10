<template>
    <div>
        <div>
            <el-upload :before-upload="handleUpload" action="default">
                <el-button type="success">
                    <d2-icon name="file-o" />
                    选择要导入的 .xlsx 表格
                </el-button>
            </el-upload>
        </div>
        <table width="100%">
            <caption>{{this.fileName}}</caption>
            <thead v-if="excelData && excelData.header">
                <tr>
                    <th>行号</th>
                    <th v-for="(item,index) in excelData.header" :key="index">{{item}}</th>
                </tr>
            </thead>
            <tbody v-if="excelData && excelData.results">
                <tr v-for="(row,rowIndex) in excelData.results" :key="rowIndex">
                    <td><input type="checkbox" :checked="row.checked===true" @change="handleRowCheckChange($event.target.checked,row)"/><span>{{rowIndex}}</span></td>
                    <td v-for="(item,index) in row" :key="index">{{item}}</td>
                </tr>
            </tbody>
        </table>
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
      selectedRowIndex: [],
      fileName: null
    }
  },

  methods: {
    handleUpload (file) {
      this.fileName = file.name
      this.excelData = null
      this.emitHeaderChange()
      this.emitSelectChange()
      this.$import.xlsx(file)
        .then(({ header, results }) => {
          this.excelData = { header, results }
          this.emitHeaderChange()
        })

      return false
    },
    getSelected () {
      if (!this.excelData || !Array.isArray(this.excelData.results)) {
        return []
      }
      return this.excelData.results.filter(x => x.checked === true)
    },
    getHeaders () {
      if (!this.excelData || !Array.isArray(this.excelData.header)) {
        return []
      }
      return this.excelData.header
    },
    handleRowCheckChange (e, row) {
      row.checked = e
      this.emitSelectChange()
    },
    emitSelectChange () {
      this.$emit('select-change', this.getSelected())
    },
    emitHeaderChange () {
      this.$emit('header-change', this.getHeaders())
    }
  }
}
</script>
