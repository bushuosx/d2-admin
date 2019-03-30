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

      ryapi.getksryreportlist().then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ksryreptlist = res.data
        } else {
          this.$message.error(res.msg)
        }
      }

      )
    }
  }
}
</script>
