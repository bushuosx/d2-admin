<template>
    <d2-container>
        <jstransfer ref="jsselector" v-bind:jslist="jslist"></jstransfer>
    </d2-container>
</template>

<script>
import jstransfer from '@/components/yljs/js/jstransfer.1.vue'

export default {
  name: 'yljs-ks-js-create',
  components: { jstransfer },
  data () {
    return {
      jslist: []
    }
  }
}
</script>
