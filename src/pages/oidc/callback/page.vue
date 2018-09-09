<template>
    <div>callback html</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('OidcService', ['saveUser'])
  },
  computed: {
    ...mapGetters('OidcService', ['UserManager'])
  },

  mounted: function () {
    // this.isLogin();
    let selt = this
    this.UserManager.signinRedirectCallback().then(function (user) {
      console.log(user.profile)

      console.log(user.profile.sub)
      alert('see console')

      selt.saveUser({ vm: this, userid: user.profile.sub })

      window.location.href = '/index'
    }).catch(function (err) {
      console.log(err)
    })
  }
}

</script>
