<template>
  <div v-loading="loading">
    <ryjs-detail :ryjs='ryjs'
                 :options="options"></ryjs-detail>
    <fast-upload title="更改为以下支撑材料"
                 @file-changed="handleFileChanged"></fast-upload>
    <div>
      <el-button @click="deleteRyjs"
                 type="error">删除此申请</el-button>
      <el-button @click="cancelRyjs">取消编辑</el-button>
      <el-button @click="saveRyjs"
                 type="primary">保存更改</el-button>
    </div>
  </div>
</template>

<script>
import ryjsapi from '@/api/yljs/ryjs'
export default {
  props: {
    ryjs: Object
  },
  components: {
    'ryjs-detail': () => import('../ryjsdetail'),
    'fast-upload': () => import('../../fast-upload')
  },
  data () {
    return {
      options: { showry: false },
      fileidlist: null,
      loading: false
    }
  },
  methods: {
    handleFileChanged (val) {
      this.fileidlist = val
    },
    deleteRyjs () {
      this.loading = true
      ryjsapi.delete([this.ryjs.id]).then(res => {
        // let rst
        // if (res.code !== 1) {
        //   rst = { code: 3, msg: res.msg }
        // } else {
        //   rst = res
        // }
        this.emitRyjs('delete-edit', res)
      }).catch(err => {
        this.emitRyjs('delete-edit', { code: 3, msg: err.message })
      })
    },
    saveRyjs () {
      // if (!Array.isArray(this.fileidlist) || this.fileidlist.length === 0) {
      //   this.$message.error('无支撑文件，不能保存')
      //   // this.emitRyjs('save-edit', { code: 3, msg: '无支撑文件，不能保存' })
      //   return
      // }

      if (!Array.isArray(this.fileidlist)) {
        this.fileidlist = []
      }

      this.loading = true
      ryjsapi.update([this.ryjs.id], this.fileidlist).then(res => {
        // let rst
        // if (res.code !== 1) {
        //   rst = { code: 3, msg: res.msg }
        // } else {
        //   rst = res
        // }
        this.emitRyjs('save-edit', res)
      }).catch(err => {
        this.emitRyjs('save-edit', { code: 3, msg: err.message })
      })
    },
    cancelRyjs () {
      this.emitRyjs('cancel-edit', { code: 3, msg: '已取消' })
    },
    emitRyjs (eventName, rst) {
      this.$emit(eventName, this.ryjs.id, rst)
      this.loading = false
    }
  }
}
</script>
