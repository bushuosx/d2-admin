<template>
  <d2-container>
    <div>我的技术列表</div>
  </d2-container>
</template>

<script>
import user from '@/libs/util.user.js'
export default {
  name: 'yljs-ry-js-index',
  created () {
    this.$router.replacePlus({ name: 'yljs-ryjs-listbyry', params: { ryid: user.userId } })
  }
}
</script>
