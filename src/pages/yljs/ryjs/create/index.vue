<template>
  <d2-container v-loading="loading">
    <el-card>
      <div slot="header">
        <h2>申请技术授权</h2>
      </div>
      <div>使用相同支撑材料的授权申请可以批量进行</div>
    </el-card>
    <el-card style="margin-top:10px">
      <div slot="header">
        <h2>步骤 1：选择要申请的技术</h2>
      </div>
      <div style="width:50%;">
        <el-input v-model="selectvalue" placeholder="请输入要查询的技术名称" class="input-with-select">
          <el-select v-model="selected" slot="prepend" placeholder="请选择">
            <el-option label="在全院技术中查询" value="1"></el-option>
            <el-option label="在科室技术中查询" value="2"></el-option>
          </el-select>
          <el-button @click="getjslist" slot="append" icon="el-icon-search">开始加载</el-button>
        </el-input>
      </div>

      <jstransfer ref="jsselector" v-bind:jslist="jslist"></jstransfer>

      <!-- <el-button @click="testjs" style="color:#F56C6C;">性能测试---使用的时候记得和方法一起删除</el-button> -->
    </el-card>
    <fast-upload @file-changed="handleFileChanged">
      <h2 slot="title">步骤 2：选择申请上述技术授权的支撑材料</h2>
    </fast-upload>
    <el-card>
      <div slot="header">
        <h2>步骤 3：提交申请，并等待审核</h2>
      </div>
      <el-button type="primary" @click="applyAll">提交</el-button>
    </el-card>
  </d2-container>
</template>

<script>
import jstransfer from '@/components/yljs/js/jstransfer.1.vue'
import ryjsapi from '@/api/yljs/ryjs'
import jsapi from '@/api/yljs/js'

export default {
  name: 'yljs-ryjs-create',
  components: { jstransfer },
  data () {
    return {
      selectvalue: null,
      selected: '2',
      jslist: [],
      ksjslist: null,
      yyjslist: null,
      fileidlist: null,
      loading: false
    }
  },
  methods: {
    ResetData () {
      // Object.assign(this.$data, this.$options.data())
      this.$refs.jsselector.ResetSelected()
    },
    applyAll () {
      if (this.loading === true) {
        return
      }

      let jsids = this.$refs.jsselector.jsidlist
      if (!jsids || jsids === undefined || jsids.length === 0) {
        this.$msgbox({ message: '请先选择要申请授权的技术', title: '未选择技术', type: 'info' })
        return
      }
      if (!this.fileidlist || !this.fileidlist.length || this.fileidlist.length === 0) {
        this.$msgbox({ message: '请上传所需的支撑材料', title: '无支撑材料', type: 'info' })
        return
      }

      this.loading = true
      let router = this.$router
      let message = this.$message
      ryjsapi.createryjs(jsids, this.fileidlist).then((res) => {
        this.loading = false
        if (res.code === 1) {
          router.push({ name: 'yljs-ry-js' })
          this.ResetData()
        } else {
          message.error(res.msg)
        }
      }).catch(function (err) {
        this.loading = false
        message.error(!err.message ? err : err.message)
      })
    },
    getjslist () {
      // 从服务器加载
      let msg = this.$message
      if (!this.selectvalue || setInterval === undefined) {
        msg({ message: '请输入查询条件', type: 'error' })
      }
      let data = this.$data
      this.loading = true
      jsapi.getbyname(this.selectvalue).then(res => {
        this.loading = false
        if (res.code === 1) {
          data.jslist = res.data
        } else {
          msg.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    testjs () {
      let count = this.jslist.length
      let j = 0
      for (let i = 0; i < 10000; i++) {
        j++
        this.jslist.push({ id: count + i + 1, mc: '胸腔闭式引流术' + i, dj: j, decs: 'xqbsyys', hidden: false })
        if (j === 4) j = 0
      }
    },
    handleFileChanged (val) {
      this.fileidlist = val
    }
  }
}
</script>

<style>
.el-select .el-input {
  width: 180px;
}
</style>
