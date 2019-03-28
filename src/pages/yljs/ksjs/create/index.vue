<template>
  <d2-container v-loading="loading">
    <strong slot="header">增加科室技术</strong>
    <div>
      <el-input v-model="searchValue"
                placeholder="请输入要查询的技术关键字">
        <template slot="prepend">从全院技术库中查询：</template>
        <el-button slot="append"
                   icon="el-icon-search"
                   @click="getjslist"></el-button>
      </el-input>
    </div>
    <jstransfer ref="jsselector"
                v-bind:jslist="jslist"></jstransfer>

    <el-button type="primary" @click="applyall">提交</el-button>
  </d2-container>
</template>

<script>
import jstransfer from '@/components/yljs/js/jstransfer.1.vue'
import ksjsapi from '@/api/yljs/ksjs'

export default {
  name: 'yljs-ksjs-create',
  components: { jstransfer },
  data () {
    return {
      jslist: [],
      loading: false,
      searchValue: null
    }
  },
  methods: {
    getjslist () {
      // 从服务器加载
      if (!this.searchValue) {
        this.$message.error('请输入搜索关键字')
        return
      }

      let data = this.$data
      this.loading = true
      ksjsapi.getbynameforcreate(this.searchValue).then(res => {
        this.loading = false
        if (res.code === 1) {
          data.jslist = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        this.loading = false
        this.$message.error(err.message ? err.message : err)
      })
    },
    ResetData () {
      // Object.assign(this.$data, this.$options.data())
      this.jslist = []
      this.$refs.jsselector.ResetSelected()
    },
    applyall () {
      if (this.loading === true) {
        return
      }
      let jsids = this.$refs.jsselector.jsidlist
      if (!jsids || jsids === undefined || jsids.length === 0) {
        this.$msgbox({ message: '请先选择要增加的技术', title: '未选择技术', type: 'info' })
        return
      }

      this.loading = true
      let router = this.$router
      ksjsapi.createksjs(jsids).then((res) => {
        this.loading = false
        if (res.code === 1) {
          this.ResetData()
          router.push({ name: 'yljs-ksjs-list' })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(function (err) {
        this.loading = false
        this.$message.error(!err.message ? err : err.message)
      })
    }
  }
}
</script>
