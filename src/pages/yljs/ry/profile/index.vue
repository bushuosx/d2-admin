<template>
  <d2-container>
    <div>我的资料</div>
  </d2-container>
</template>

<script>
// import ryprofileapi from '@/api/yljs/ryprofile'
import user from '@/libs/util.user.js'
export default {
  name: 'yljs-ry-profile',
  created () {
    this.$router.replacePlus({ name: 'yljs-ryprofile-index', params: { ryid: user.userId } })
    // let ryprofileid = user.profileId
    // if (!ryprofileid) {
    //   ryprofileapi.getmyprofile().then(res => {
    //     if (res.code === 1) {
    //       user.profileId = res.data.id
    //       this.$router.replacePlus({ name: 'yljs-ryprofile-index', params: { ryprofileid: res.data.id } })
    //     } else {
    //       this.errmsg = res.msg
    //     }
    //   }).catch(err => {
    //     this.errmsg = err.message
    //   })
    // } else {
    //   this.$router.replacePlus({ name: 'yljs-ryprofile-index', params: { ryprofileid } })
    // }
  }
}
</script>
