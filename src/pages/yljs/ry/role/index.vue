<template>
  <div></div>
</template>

<script>
import role from '@/libs/util.user.js'
export default {
  created () {
    console.log(role)
    this.$router.replacePlus({ name: 'yljs-ryrole-index', params: { ryid: role.userId } })
  }
}
</script>
