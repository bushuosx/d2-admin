<template>
  <div class="mypagination">
    <el-button v-if="pageIndex > 1"
               type="primary"
               size="mini"
               plain
               @click="emitPageIndexChange(1)">首页</el-button>
    <el-button v-if="pageIndex > 5"
               icon="el-icon-d-arrow-left"
               size="mini"
               @click="emitPageIndexChange(pageIndex-5)">前五页</el-button>
    <el-button v-if="pageIndex > 2"
               icon="el-icon-arrow-left"
               size="mini"
               @click="emitPageIndexChange(pageIndex-1)">前一页</el-button>
    <el-button type="primary"
               size="mini"
               disabled>第{{pageIndex}}页</el-button>
    <el-button icon="el-icon-arrow-right"
               size="mini"
               @click="emitPageIndexChange(pageIndex+1)">后一页</el-button>
    <el-button icon="el-icon-d-arrow-right"
               size="mini"
               @click="emitPageIndexChange(pageIndex+5)">后五页</el-button>
    <el-input v-model="indexValue"
              style="width:60px;margin-left:20px"
              size="mini"></el-input>
    <el-button size="mini"
               @click="handleTurn">跳转</el-button>
  </div>
</template>

<script>
export default {
  props: {
    pageIndex: {
      type: Number,
      default: 1
    }
  },
  data () {
    return { indexValue: '' }
  },
  methods: {
    emitPageIndexChange (val) {
      this.$emit('page-index-change', val)
    },
    handleTurn () {
      if (!this.indexValue) {
        return false
      }
      let v = parseInt(this.indexValue)
      if (v < 1) {
        return false
      }
      this.emitPageIndexChange(v)
    }
  }

}
</script>

<style>
div.mypagination {
  text-align: center;
  margin: 1em 0;
}
</style>
