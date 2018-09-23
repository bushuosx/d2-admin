<template>
  <div class="debuglogin">
    <button style="margin-top:30px" @click="debuglogin">模拟登录</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions('d2admin/account', ['logincallback']),
    debuglogin () {
      this.logincallback({ vm: this, debug: true })
      window.location.href = '/yljs'
    }
  }
}
</script>

<style>
div.debuglogin {
  margin: 0 auto;
  width: 320px;
  height: 100px;
  border: 1px solid #f00;
}
</style>
