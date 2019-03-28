<template>
  <d2-container v-loading="loading">
    <el-card>
      <div>这里显示的是科室维护的技术数据，非科室人员实际拥有的技术</div>
      <jslistTable v-bind:jsList="jslist"></jslistTable>
      <el-button type="primary"
                 @click="fetchData">刷新</el-button>
    </el-card>
  </d2-container>
</template>

<script>
import ksjsapi from '@/api/yljs/ksjs'

export default {
  name: 'yljs-ksjs-list',
  components: {
    'jslistTable': () => import('@/components/yljs/jslist')
  },
  data () {
    return {
      jslist: [],
      loading: false
    }
  },
  created () {
    // fetch未审核人员
    this.fetchData()
  },
  methods: {
    fetchData () {
      if (this.loading) return

      this.loading = true

      ksjsapi.getksjslist().then(res => {
        this.loading = false
        if (res.code === 1) {
          this.jslist = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        this.loading = false
        this.$message.error(err.message ? err.message : err)
      })
    }
  }
}
</script>
