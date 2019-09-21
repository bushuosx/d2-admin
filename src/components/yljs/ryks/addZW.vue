<template>
  <div>
    <el-select v-model="selected"
               value-key="id">
      <el-option v-for="ryks in ryksList"
                 :key="ryks.id"
                 :label="ryks.ry.xm"
                 :value="ryks">
      </el-option>
    </el-select>
    <el-button v-if="!!selected"
               @click="handleClick">增加</el-button>
  </div>
</template>

<script>
export default {
  props: {
    ryksList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selected: null
    }
  },
  methods: {
    handleClick () {
      this.$emit('add-click', this.selected)
    }
  }
}
</script>
