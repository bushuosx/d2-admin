<template>
  <d2-container v-loading="loading">
    <el-card>
      <div slot="header">
        <h2>申请技术授权</h2>
      </div>
      <div>使用相同支撑材料的授权申请可以批量进行</div>
      <!-- <a href="/public/医疗技术临床应用授权申请表.docx">点击下载医疗技术授权申请表</a> -->
    </el-card>
    <template v-if="canApplyRYJS">
      <el-card style="margin-top:10px">
        <div slot="header">
          <h2>步骤 1：选择要申请的技术</h2>
        </div>
        <div style="width:50%;">
          <el-input v-model="selectvalue"
                    placeholder="请输入要查询的技术名称"
                    class="input-with-select"
                    :disabled="!hasAnyKS">
            <el-select v-model="selected"
                       slot="prepend"
                       placeholder="请选择科室">
              <el-option v-for="(ks,index) in user.ksList"
                         :key="index"
                         :label="'从'+ks.mc+'中查询'"
                         :value="ks.id"></el-option>
            </el-select>
            <el-button @click="getjslist"
                       slot="append"
                       icon="el-icon-search">
              <el-tooltip content="仅加载未申请的技术"
                          placement="top"
                          effect="light">
                <span>开始加载</span>
              </el-tooltip>
            </el-button>
          </el-input>
        </div>

        <jstransfer ref="jsselector"
                    v-bind:jslist="jslist"></jstransfer>

        <!-- <el-button @click="testjs" style="color:#F56C6C;">性能测试---使用的时候记得和方法一起删除</el-button> -->
      </el-card>
      <fast-upload @file-changed="handleFileChanged">
        <h2 slot="title">步骤 2：选择申请上述技术授权的支撑材料(限制类技术须上传)</h2>
      </fast-upload>
      <el-card>
        <div slot="header">
          <h2>步骤 3：提交申请，并等待审核</h2>
        </div>
        <el-button type="primary"
                   @click="applyAll">提交</el-button>
      </el-card>

    </template>
    <el-card v-else>
      <h1 slot="header"
          class="sorry">Sorry !</h1>
      <div>目前只允许 <strong>医师、技师</strong> 岗位的人员申请技术授权</div>
    </el-card>
  </d2-container>
</template>

<script>
import jstransfer from '@/components/yljs/js/jstransfer.1.vue'
import ryjsapi from '@/api/yljs/ryjs'
// import jsapi from '@/api/yljs/js'
import ksjsapi from '@/api/yljs/ksjs'
import userUtil from '@/libs/util.user.js'

export default {
  name: 'yljs-ryjs-create',
  components: { jstransfer },
  data () {
    return {
      selectvalue: null,
      selected: '',
      jslist: [],
      ksjslist: null,
      yyjslist: null,
      fileidlist: null,
      loading: false
    }
  },
  computed: {
    user () {
      return userUtil(this.$store)
    },
    hasAnyKS () {
      return !!this.user && Array.isArray(this.user.ksList) && this.user.ksList.length > 0
    },
    canApplyRYJS () {
      // 允许 医师、技师
      const allowed = [1, 3]
      return !!this.user && !!this.user.profile && allowed.findIndex(x => x === this.user.profile.gw) !== -1
    }
  },
  methods: {
    ResetData () {
      // Object.assign(this.$data, this.$options.data())
      this.jslist = []
      this.$refs.jsselector.ResetSelected()
    },
    applyAll () {
      if (this.loading === true) {
        return
      }

      if (!this.canApplyRYJS) {
        return
      }

      let jsids = this.$refs.jsselector.jsidlist
      if (!jsids || jsids === undefined || jsids.length === 0) {
        this.$msgbox({ message: '请先选择要申请授权的技术', title: '未选择技术', type: 'info' })
        return
      }

      if (!Array.isArray(this.fileidlist) || this.fileidlist.length === 0) {
        let hasLimited = this.$refs.jsselector.hasLimitedJS
        if (hasLimited === true) {
          this.$msgbox({ message: '你选择的技术含有限制类技术，请上传所需的支撑材料', title: '限制类技术须有支撑材料', type: 'info' })
          return
        }
      }

      this.loading = true
      let router = this.$router
      let message = this.$message
      ryjsapi.createryjs(jsids, this.fileidlist).then((res) => {
        this.loading = false
        if (res.code === 1) {
          router.push({ name: 'yljs-ryjs-listbyry', params: { ryid: this.user.id } })
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
      // let msg = this.$message
      if (!this.selected) {
        this.$message.error('请选择一个科室')
        return
      }
      let data = this.$data
      this.loading = true
      let api = null
      if (this.selected) {
        api = ksjsapi.getbynameforusercreate(this.selected, this.selectvalue)
        // } else if (this.selected === '1') {
        //   api = jsapi.getbyname(this.selectvalue)
      } else {
        this.loading = false
        this.$message.error('没有选择任何有效的科室')
      }

      api.then(res => {
        this.loading = false
        if (res.code === 1) {
          data.jslist = res.data
        } else {
          this.$message.error(res.msg)
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
.sorry {
  color: red;
}
</style>
