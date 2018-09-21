<template>
  <div>
    <h2>正在完成登录……</h2>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  mounted: function () {
    this.logincallback({ vm: this })
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logincallback'
    ])
  }
}
</script>
