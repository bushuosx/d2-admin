<template>
  <div>
    <h2>{{msg}}</h2>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Oidc from '@/api/oidc'
import ryapi from '@/api/yljs/ry'
export default {
  data: function () {
    return {
      msg: '正在完成登录……'
    }
  },
  mounted: function () {
    Oidc.loginCallback()
      .then(user => {
        // 查询用户
        if (user.profile.sub) {
          this.msg = '正在获取用户信息……'
          return ryapi.getorcreate({
            id: user.profile.sub,
            gh: user.profile.name,
            create: true,
            token: user.access_token })
            .then(res => {
              if (res.code === 1) {
                this.msg = '成功获取用户信息'
                // 存入 vuex
                let yljsuser = res.data
                yljsuser.access_token = user.access_token
                this.logincallback({ vm: this, yljsuser })
              } else {
                this.msg = res.msg
              }
            })
        } else {
          this.msg = 'SSO返回的用户信息与预期不符'
        }
      })

      .catch(err => { this.$message.error(err) })
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logincallback'
    ])
  }
}
</script>
