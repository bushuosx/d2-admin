<template>
<d2-container>
    <import-excel ref="iexcel" @header-change="handleHeaderChange"></import-excel>
</d2-container>
</template>

<script>
export default {
  components: {
    'import-excel': () => import('@/components/ImportExcel')
  },
  data () {
    return {
      headers: []
    }
  },
  methods: {
    handleHeaderChange (val) {
      this.headers = val
    }
  }
}
</script>
