<template>
  <d2-container v-loading="loading">
    <template slot="header">
      <div><span>科室：</span></div>
    </template>
    <ry-table :ryList="ryList"></ry-table>
  </d2-container>
</template>

<script>
import ryksapi from '@/api/yljs/ryks'

export default {
  props: {
    ksid: String
  },
  components: {
    'ry-table': () => import('@/components/yljs/rytable')
  },
  data () {
    return {
      ryList: null,
      loading: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      ryksapi.getrybyks(this.ksid).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ryList = res.data
        } else {
          this.$messgae.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
