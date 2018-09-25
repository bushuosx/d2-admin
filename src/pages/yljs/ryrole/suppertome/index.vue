<template>
    <div>
        <button @click="suppertome">SupperToMe</button>
    </div>
</template>

<script>
import ryroleaspi from '@/api/yljs/ryrole'
export default {
  mounted: {
    suppertome () {
      ryroleaspi.suppertome().then(res => {
        if (res.code === 1) {
          this.$message({ message: 'succeed', type: 'success' })
        } else {
          this.$message({ messgae: res.msg, type: 'error' })
        }
      }).catch(err => {
        this.$message({ messgae: err, type: 'error' })
      })
    }
  }
}
</script>
