<template>
<d2-container>
    <import-excel @select-change="handleSelectChange" @header-change="handleHeaderChange"></import-excel>

</d2-container>
</template>

<script>
export default {
  components: {
    'import-excel': () => import('@/components/ImportExcel')
  },
  methods: {
    handleSelectChange (val) {
      console.log(val)
    },
    handleHeaderChange (val) {
      console.log(val)
    }
  }
}
</script>
