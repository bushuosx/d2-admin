<template>
    <d2-container>
        <div>人员技术详细信息</div>
        <ryjstable :data="ryjslist"></ryjstable>
    </d2-container>
</template>

<script>
// import ryjsapi from '@/api/yljs/ryjs'
export default {
  name: 'yljs-ryjs-index',
  props: { ryjsid: String },
  data () { }
}
</script>
