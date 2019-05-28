<template>
  <div>
    <slot name="header"> <strong>查询筛选器</strong></slot>
    <el-row style="margin-top:6px">
      <el-col :span="6">
        <el-input v-model="jsfilter.mc"
                  placeholder="输入技术名称"
                  clearable>
          <span slot="prepend">按名称</span>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-input v-model="jsfilter.bm"
                  placeholder="输入技术编码"
                  clearable>
          <span slot="prepend">按编码</span>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-input v-model="jsfilter.dj"
                  type="Number"
                  placeholder="输入技术等级"
                  clearable>
          <span slot="prepend">按等级</span>
        </el-input>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="6">
        <el-checkbox v-model="jsfilter.limited"
                     label="只搜索限制性技术"
                     border>
        </el-checkbox>
        <el-button type="primary"
                   @click="handleClick">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      jsfilter: {}
    }
  },
  props: {
    searchOption: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    searchOption: { handler: function (n) {
      this.jsfilter = { ...n }
    },
    immediate: true
    }
  },
  methods: {
    handleClick () {
      this.$emit('jssearch-click', this.jsfilter)
    },
    handleReset () {
      this.jsfilter = { limited: false }
      this.$emit('jssearch-reset')
    }
  }
}
</script>
