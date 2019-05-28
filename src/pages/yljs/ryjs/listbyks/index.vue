<template>
  <d2-container>
    <el-card v-loading='loading'>
      <div slot="header">
        <h3>科室人员的技术授权</h3>
      </div>
      <jssearch @jssearch-click='handClick'></jssearch>

      <js-report style="margin-top:16px"
                 :jsReport="ksjsReport"
                 @click-js="handleClickJS"></js-report>
      <my-pagination :pageIndex="pageIndex"
                     @page-index-change="handlePageIndexChande"></my-pagination>
    </el-card>
  </d2-container>
</template>

<script>
/**
 * 此页面需科级审核权限
 */
import ryjsapi from '@/api/yljs/ryjs'
export default {
  name: 'yljs-ryjs-listbyks',
  components: {
    'jssearch': () => import('@/components/yljs/jssearch'),
    'js-report': () => import('@/components/yljs/jsreport'),
    'my-pagination': () => import('@/components/MyPagination')
  },
  props: {
    ksid: String
  },
  data () {
    return {
      loading: true,
      ksjsReport: [],
      pageIndex: 1,
      searchOtion: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.ksjsReport = []
      this.searchOtion.ksid = this.ksid
      this.searchOtion.pageIndex = this.pageIndex
      ryjsapi.searchjsreport(this.searchOtion).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ksjsReport = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handClick (val) {
      this.searchOtion = val
      this.pageIndex = 1
      this.fetchData()
    },
    handlePageIndexChande (val) {
      this.pageIndex = val
      this.fetchData()
    },
    handleClickJS (js) {
      if (js) {
        this.loading = true
        ryjsapi.getrybyksandjs(this.ksid, js.id).then(res => {
          this.loading = false
          if (res.code === 1) {
            this.$router.push({ name: 'yljs-ry-listbyjs', params: { tag1: '科室', tag2: js.mc, ryList: res.data } })
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>
