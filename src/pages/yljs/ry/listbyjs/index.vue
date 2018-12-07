<template>
  <d2-container>
    <template slot="header"><strong>{{tag1}} 已授权技术 <el-tag type="success">{{tag2}}</el-tag> 的人员</strong></template>
    <ry-table :ryList="ryList"></ry-table>
  </d2-container>
</template>

<script>
export default {
  name: 'yljs-ry-list',
  props: {
    ryList: Array,
    tag1: String,
    tag2: String
  },
  components: {
    'ry-table': () => import('@/components/yljs/rytable')
  }
}
</script>
