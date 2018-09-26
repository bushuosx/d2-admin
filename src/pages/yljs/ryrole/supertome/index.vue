<template>
  <d2-container>
    <div>
      <button @click="supertome">SupperToMe</button>
    </div>
  </d2-container>
</template>

<script>
import ryroleapi from '@/api/yljs/ryrole'
export default {
  methods: {
    supertome () {
      ryroleapi.supertome().then(res => {
        if (res.code === 1) {
          this.$message({ message: 'succeed', type: 'success' })
        } else {
          this.$message({ messgae: res.msg, type: 'error' })
        }
      }).catch(err => {
        let msg = !err.message ? err.message : err
        this.$message({ messgae: msg, type: 'error' })
      })
    }
  }
}
</script>
