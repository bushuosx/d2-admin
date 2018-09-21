<template>
  <div>
    <button @click="logincallback({vm:this,debug:true})">模拟登录</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions('d2admin/account', ['logincallback'])
  }
}
</script>
