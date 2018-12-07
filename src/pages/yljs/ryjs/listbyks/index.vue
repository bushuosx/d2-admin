<template>
  <d2-container>
    <el-card v-loading='loading'>
      <div slot="header">
        <h3>人员技术</h3>
        <div>以下是科室人员的技术授权</div>
      </div>
      <js-report :jsReport="ksjsReport"
                 :options="{showcount:true}"
                 @click-js="handleClickJS"></js-report>
      <my-pagination :pageIndex="pageIndex"
                     @page-index-change="fetchData"></my-pagination>
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
    'js-report': () => import('@/components/yljs/jsreport'),
    'my-pagination': () => import('@/components/MyPagination')
  },
  props: {
    ksid: String
  },
  data () {
    return {
      loading: true,
      ksjsReport: null,
      pageIndex: 1
    }
  },
  created () {
    this.fetchData(1)
  },
  methods: {
    fetchData (val) {
      this.pageIndex = val
      this.loading = true
      ryjsapi.getbyks(this.ksid, val).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ksjsReport = res.data
        } else if (res.code === 2) {
          this.$message.warning('没有查询到更多数据')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
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
