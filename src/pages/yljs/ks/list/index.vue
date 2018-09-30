<template>
    <d2-container>
        <div>所有科室列表</div>
        <kstable :kslist="kslist"></kstable>
    </d2-container>
</template>

<script>
import ksapi from '@/api/yljs/ks'
export default {
  name: 'yljs-ks-list',
  components: {
    kstable: () => import('@/components/yljs/kstable')
  },

  data () {
    return {
      kslist: []
    }
  },
  created () {
    ksapi.getallks().then(res => {
      if (res.code === 1) {
        this.kslist = res.data
      } else {
        this.$message.error(res.msg)
      }
    })
  }
}
</script>
