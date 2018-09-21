<template>
  <div>
    <h2>已完成登录</h2>
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
    ]),
    getToken () { return this.$route.params.sid },
    getSub () { return this.$route.params.sub },
    getName () { return this.$route.params.name }
  }
}
</script>
