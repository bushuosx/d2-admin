<template>
  <el-dropdown class="d2-mr">
    <span class="btn-text">{{helloMessage}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-if="isLogon" @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5" />
        注销
      </el-dropdown-item>
      <el-dropdown-item v-else @click.native="logIn">
        <d2-icon name="key" class="d2-mr-5" />
        登录
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    isLogon () {
      return !!this.info && !!this.info.id
    },
    helloMessage () {
      if (this.isLogon) {
        return `你好 ${this.info.xm}`
      } else {
        return '你好，请登录'
      }
    }
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        vm: this,
        confirm: true
      })
    },
    logIn () {
      window.location.href = '/account/login/yljs'
    }
  }
}
</script>
