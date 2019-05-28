<template>
  <d2-container v-loading="loading">
    <jssearch @jssearch-click='handClick'></jssearch>
    <jslisttable style="margin-top:10px"
                 :jsList="jsList"
                 :showActioner="true">
      <el-button slot="actioner"
                 slot-scope="scope"
                 @click="handleClickJS(scope.js)">编辑</el-button>
    </jslisttable>
    <mypagination @page-index-change="handlePageIndex"
                  :pageIndex="pageIndex"></mypagination>

    <el-dialog :visible.sync="editDialogVisible"
               title="修改技术信息">
      <js-edit :js="focusJS"
               :zyList="zyList"
               @edit-save="handleEditSave"
               @edit-cancel="editDialogVisible=false"></js-edit>
    </el-dialog>
  </d2-container>
</template>

<script>
import jsapi from '@/api/yljs/js'
import zylbapi from '@/api/yljs/zylb'
export default {
  name: 'yljs-manage-js-updatejs',
  components: {
    'jssearch': () => import('@/components/yljs/jssearch'),
    'jslisttable': () => import('@/components/yljs/jslist'),
    'js-edit': () => import('@/components/yljs/jsedit'),
    'mypagination': () => import('@/components/MyPagination')
  },
  data () {
    return {
      jsList: [],
      zyList: null,
      loading: false,
      searchOtion: null,
      pageIndex: 1,
      editDialogVisible: false,
      focusJS: null
    }
  },
  created () {
    this.fetchZY()
  },
  methods: {
    fetchZY () {
      this.loading = true
      this.zyList = null
      zylbapi.getall().then(res => {
        this.loading = false
        if (res.code === 1) {
          this.zyList = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    fetchData () {
      this.loading = true
      this.jsList = []
      this.searchOtion.pageIndex = this.pageIndex

      jsapi.searchjs(this.searchOtion).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.jsList = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    handClick (val) {
      this.searchOtion = val
      this.pageIndex = 1
      this.fetchData()
    },
    handleClickJS (js) {
      //   console.log(js)
      this.focusJS = { ...js }
      this.editDialogVisible = true
    },
    handleEditSave (js) {
      //   console.log('修改完毕')
      //   console.log(js)
      this.editDialogVisible = false
      if (!!js && !!js.id) {
        let i = this.jsList.findIndex(v => v.id === js.id)
        if (i !== -1) {
          // 启动更新
          this.loading = true
          jsapi.updatejs(js).then(res => {
            this.loading = false
            if (res.code === 1) {
              this.jsList.splice(i, 1, js)
              this.$message.success('更新成功')
            } else {
              this.$message.error('更新出错：' + res.msg)
            }
          }).catch(() => { this.loading = false })
        }
      }
    },
    handlePageIndex (i) {
      this.pageIndex = i
      this.fetchData()
    }
  }
}
</script>
