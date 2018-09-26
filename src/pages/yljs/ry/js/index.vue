<template>
    <d2-container>
        <div>我的技术列表</div>
        <ryjstable></ryjstable>
    </d2-container>
</template>

<script>
export default {
  name: 'yljs-ry-js-index',
  components: {
    ryjstable: () => import('@/components/yljs/ryjstable')
  }
}
</script>
