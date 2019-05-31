<template>
  <div class="debuglogin">
    <button style="margin-top:30px"
            @click="debugLogin">模拟登录</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import util from '@/libs/util.user.js'
export default {
  methods: {
    ...mapActions('d2admin/account', ['logincallback']),
    getDebugUser () {
      // 要检索的值
      let spauser

      // debug登录
      console.log(process.env)
      // debugger
      let uuid
      let name
      let ksid
      let profileid
      // 设置为全权限
      const fillallpermissions = true
      let permissions = []
      if (fillallpermissions) {
        const ALLPermisions = util.Permissions
        for (let v in ALLPermisions) {
          permissions.push({ value: ALLPermisions[v], name: v })
        }
      } else {
        permissions.push({ value: 9600, name: '科室角色管理权限' })
      }

      if (process.env.VUE_APP_PC === 'JJPC') {
        uuid = '5097B183-ADEF-4DB5-FD12-08D620975F69'.toLowerCase() // JJPC
        ksid = 'ef11af9f-8cdb-4d2c-3386-08d62c131173'.toLowerCase() // JJPC
        profileid = 'A3A2C82E-1BFA-4AE2-30FE-08D62C19313E'.toLowerCase()
        name = 'jjpc'
      } else {
        uuid = '019932A8-194D-4785-66F5-08D622B6098B'.toLowerCase() // YWBPC
        ksid = 'bc139d6b-f23a-440d-ac80-08d622bc65bd'.toLowerCase()// ywbpc
        profileid = 'AA0946D2-0906-4A44-DD40-08D62CC2AF83'.toLowerCase() // ywbpc
        name = 'ywbpc'
      }
      spauser = {
        id: uuid,
        ksList: [{ id: ksid, mc: '呼吸2' }],
        roleList: [{ role: { permissions }, ks: { id: ksid, mc: '呼吸2' } }],
        xm: name,
        profile: { id: profileid } }
      return spauser
    },
    debugLogin () {
      this.logincallback({ vm: this, yljsuser: this.getDebugUser() })
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
