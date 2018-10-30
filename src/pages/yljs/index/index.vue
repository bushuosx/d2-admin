<template>
  <d2-container>
    <div slot="header">医疗技术授权管理系统首页</div>
    <div class="page-index">
      <div v-if="!isLogon"
        class="div-login">
        <h2 class="div-login-header">欢迎使用《医疗技术临床应用授权管理系统》</h2>
        <el-button @click="handleLogon"
          class="div-login-btn"
          type="primary"
          size="large">请登录</el-button>
      </div>
      <el-card v-else
        class="nav-card"
        v-for="(menu,i) in this.$root.__asideMenu[0].children"
        :key="i"
        shadow="always">
        <div slot="header"><strong>{{menu.title}}</strong></div>
        <div class="nav-card-content">
          <div v-for="(submenu,subi) in menu.children"
            :key="subi">
            <template v-if="submenu.children">
              <div>{{submenu.title}}</div>
              <div v-for="(lastmenu,lasti) in submenu.children"
                :key="lasti"
                style="padding-left:2em;">
                <div class="div-link">
                  <d2-icon :name="lastmenu.icon"></d2-icon>
                  <router-link :to="{path:lastmenu.path}">{{lastmenu.title}}</router-link>
                </div>
              </div>
            </template>
            <div v-else
              class="div-link">
              <d2-icon :name="submenu.icon"></d2-icon>
              <router-link :to="{path:submenu.path}">{{submenu.title}}</router-link>
            </div>
          </div>
        </div>
      </el-card>
    </div>

  </d2-container>
</template>
<script>
import user from '@/libs/util.user.js'
export default {
  components: {
    'd2-icon': () => import('@/components/d2-icon')
  },
  computed: {
    isLogon () {
      return user.isLogon()
    }
  },
  methods: {
    handleLogon () {
      window.location.href = '/account/login/yljs'
    }
  }
}
</script>

<style>
.page-index {
  background-image: url("/yljs/image/card.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  width: 100%;
  top: 0px;
  bottom: 0px;
  left: 0px;
}
.nav-card {
  width: 30%;
  height: 30%;
  margin-left: 1em;
  margin-top: 1em;
  display: inline-block;
  /* background: linear-gradient(
    to bottom right,
    rgb(223, 219, 165) 0%,
    #ffffff 100%
  ); */
  opacity: 0.7;
  overflow-y: auto;
}

.nav-card:hover {
  opacity: 0.8;
  background-color: #e1f5fe;
}

.div-login-header {
  margin: 4em 0em 2em 4em;
}

.div-login-btn {
  margin-left: 20em;
}
.div-link * {
  margin: 0.4em;
}
.div-link a:hover {
  font-size: 1.2em;
}
</style>
