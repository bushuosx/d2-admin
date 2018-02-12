// 库
import Csv from './_csv'
import ExportCsv from './_export-csv'
import FileSaver from 'file-saver'
import * as Excel from './_export2Excel'
export default {
  install (Vue, options) {
    Vue.prototype.$export = {
      // 导出 CSV
      csv (params) {
        return new Promise((resolve, reject) => {
          // 默认值
          const paramsDefault = {
            columns: [],
            data: [],
            title: 'table',
            noHeader: false
          }
          // 合并参数
          const _params = Object.assign({}, paramsDefault, params)
          // 生成数据
          const data = Csv(_params.columns, _params.data, params, _params.noHeader)
          // 下载数据
          ExportCsv.download(_params.title, data)
          // 完成
          resolve()
        })
      },
      // 导出 Excel
      excel (params) {
        return new Promise((resolve, reject) => {
          // 默认值
          const paramsDefault = {
            columns: [],
            data: [],
            title: 'table'
          }
          // 合并参数
          const _params = Object.assign({}, paramsDefault, params)
          // 从参数中派生数据
          const header = _params.columns.map(e => e.label)
          const data = _params.data.map(row => _params.columns.map(col => row[col.prop]))
          // 导出 Excel
          Excel.export_json_to_excel(header, data, _params.title)
          // 完成
          resolve()
        })
      },
      txt (params) {
        return new Promise((resolve, reject) => {
          // 默认值
          const paramsDefault = {
            text: '',
            title: 'text'
          }
          // 合并参数
          const _params = Object.assign({}, paramsDefault, params)
          // 导出
          const blob = new Blob([_params.text], {type: 'text/plain;charset=utf-8'})
          FileSaver.saveAs(blob, _params.title + '.txt')
          // 完成
          resolve()
        })
      }
    }
  }
}
