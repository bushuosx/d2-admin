<template>
  <d2-container class="page-index">
    <div slot="header">医疗技术授权管理系统首页</div>
    <el-card class="nav-card" v-for="(menu,i) in this.$root.__asideMenu[0].children" :key="i" shadow="always">
      <div slot="header"><strong>{{menu.title}}</strong></div>
      <div class="nav-card-content">
        <div v-for="(submenu,subi) in menu.children" :key="subi">
          <template v-if="submenu.children">
            <div>{{submenu.title}}</div>
            <div v-for="(lastmenu,lasti) in submenu.children" :key="lasti" style="padding-left:2em;">
              <router-link :to="{path:lastmenu.path}">{{lastmenu.title}}</router-link>
            </div>
          </template>
          <router-link v-else :to="{path:submenu.path}">{{submenu.title}}</router-link>
        </div>
      </div>
    </el-card>
  </d2-container>
</template>
<script>
export default {
}
</script>

<style>
/* .page-index{
  background-image: url("http://www.xgjk.com/UploadFiles/banner2.jpg")
} */
.nav-card {
  width: 30%;
  margin-left: 1em;
  margin-top: 1em;
  display: inline-block;
  /* background: linear-gradient(to bottom right, rgb(223, 219, 165) 0%, #ffffff 100%); */
  background-image: url("/yljs/image/card.jpg");
  background-repeat:no-repeat;
  background-size: 100% 100%;
}
.nav-card-content {
  height: 120px;
  overflow-y: auto;
}
/* .el-card__header{
  background-color: #80CBC4;
}
.el-card__body{
  background-color: #E8F5E9;
} */
</style>
