<template>
  <div>我的技术授权</div>
</template>

<script>
/**
 * 个人技术
 */
import user from '@/libs/util.user.js'
export default {
  name: 'yljs-ry-js',
  created () {
    this.$router.replacePlus({ name: 'yljs-ryjs-listbyry', params: { ryid: user.userId } })
  }
}
</script>
