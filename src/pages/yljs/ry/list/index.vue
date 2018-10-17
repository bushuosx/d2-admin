<template>
    <d2-container>
        <strong slot="header">{{title}}</strong>
        <ry-table :ryList="ryList"></ry-table>
    </d2-container>
</template>

<script>
export default {
  name: 'yljs-ry-list',
  props: {
    ryList: Array,
    title: String
  },
  components: {
    'ry-table': () => import('@/components/yljs/rytable')
  }
}
</script>
