<template>
  <div>
    <span>{{focusRYKS.ry? focusRYKS.ry.xm:''}}</span>
    <el-button @click="handleClick"
               type="danger"
               plain
               size="small">移除</el-button>
  </div>
</template>

<script>
export default {
  props: {
    focusRYKS: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    handleClick () {
      this.$emit('remove-click', this.focusRYKS)
    }
  }
}
</script>
