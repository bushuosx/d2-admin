import store from '@/store/index'

export default {
  computed: {
    cUser () {
      return store.state.d2admin.user.info
    },
    userName () { return this.cUser.name },
    userId () { return this.cUser.uuid },
    userRoles () { return this.cUser.roles }
  },
  methods: {
    hasAllRoles () {
      for (let i in arguments) {
        let found = false
        for (let j in this.userRoles) {
          if (arguments[i] === this.userRoles[j]) {
            found = true
            break
          }
        }
        if (found === false) {
          return false
        }
      }
      return true
    }
  }
}
