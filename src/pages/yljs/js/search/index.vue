<template>
  <d2-container v-loading="loading">
    <jssearch @jssearch-click='handClick'
              :searchOption="searchOption"></jssearch>
    <jsreport style="margin-top:10px"
              :jsReport="report"
              :options="{showcount:true}"
              @click-js="handClickCount"></jsreport>
    <mypagination @page-index-change="handlePageIndex"
                  :pageIndex="pageIndex"></mypagination>
  </d2-container>
</template>

<script>
import ryjsapi from '@/api/yljs/ryjs'
export default {
  name: 'yljs-js-search',
  components: {
    'jssearch': () => import('@/components/yljs/jssearch'),
    'jsreport': () => import('@/components/yljs/jsreport'),
    'mypagination': () => import('@/components/MyPagination')
  },
  props: {
    soption: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    soption: { handler: function (n) {
      this.searchOption = { ...n }
      this.fetchData()
    },
    immediate: true
    }
  },
  data () {
    return {
      report: [],
      loading: false,
      pageIndex: 1,
      searchOption: {}
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      this.report = []
      this.searchOption.pageIndex = this.pageIndex

      ryjsapi.searchjsreport(this.searchOption).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.report = res.data
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    handClick (val) {
      this.searchOption = val
      this.pageIndex = 1
      this.fetchData()
    },
    handClickCount (js) {
      // console.log(js)
      if (js) {
        this.loading = true
        ryjsapi.getrylistbyjs(js.id).then(res => {
          this.loading = false
          if (res.code === 1) {
            this.$router.push({ name: 'yljs-ry-listbyjs', params: { tag1: '本院', tag2: js.mc, ryList: res.data, showks: true } })
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    handlePageIndex (i) {
      this.pageIndex = i
      this.fetchData()
    }
  }
}
</script>
