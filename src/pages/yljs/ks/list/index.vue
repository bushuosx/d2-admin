<template>
    <d2-container>
        <div>所有科室列表</div>
        <kstable :kslist="kslist"></kstable>
    </d2-container>
</template>

<script>
export default {
  name: 'yljs-ks-list',
  components: {
    kstable: () => import('@/components/yljs/kstable')
  },
  data () {
    return {
      kslist: [{ id: '1169', mc: '呼吸2' }]
    }
  }
}
</script>
