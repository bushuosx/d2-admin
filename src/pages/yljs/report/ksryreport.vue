<template>
  <d2-container v-loading="loading">
    <ryrept v-bind:ksryreportlist="ksryreptlist"></ryrept>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'

export default {
  name: 'manage-report-ksryreport',
  components: {
    ryrept: () => import('@/components/yljs/ksryreport')
  },
  data () {
    return {
      ksryreptlist: [],
      loading: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true

      let sortks = function (a, b) {
        if (!a.ks || !a.ks.mc) return 1
        if (!b.ks || !b.ks.mc) return -1
        return a.ks.mc.localeCompare(b.ks.mc, 'zh')
      }

      ryapi.getksryreportlist().then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ksryreptlist = res.data.sort(sortks)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.message ? err.message : err)
      })
    }
  }
}
</script>
