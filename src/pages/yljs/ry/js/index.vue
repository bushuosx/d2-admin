<template>
  <d2-container>
    <el-card v-loading='loading'>
      <div slot="header">
        <h3>我的技术授权</h3>
      </div>
      <ryjs-table v-on:ryjs-changed="handleRyjsChanged" v-on:selection-changed="selectedChange" :ryjslist="ryjslist" :options="{showry:true}"></ryjs-table>
    </el-card>
  </d2-container>
</template>

<script>
/**
 * 个人技术
 */
import ryjsapi from '@/api/yljs/ryjs'
export default {
  name: 'yljs-ry-js',
  components: {
    'ryjs-table': () => import('@/components/yljs/ryjstable')
  },
  data () {
    return {
      loading: true,
      ryjslist: null,
      multipleSelection: []
    }
  },
  computed: {
    anySelected () {
      return this.multipleSelection !== null && this.multipleSelection !== undefined && this.multipleSelection.length > 0
    }
  },
  created () {
    // fetch未审核人员
    ryjsapi.getmine().then(res => {
      this.loading = false
      if (res.code === 1) {
        this.ryjslist = res.data
      } else if (res.code === 2) {
        this.$message.warning('该人员还没有已授权的技术')
      } else {
        this.$message.error(res.msg)
      }
    }).catch(() => {
      this.loading = false
    })
  },
  methods: {
    selectedChange (val) {
      this.multipleSelection = val
    },
    getSelectedId () {
      let rst = []
      for (let i in this.multipleSelection) {
        rst.push(this.multipleSelection[i].id)
      }
      return rst
    },
    handleRyjsChanged (rowid, rst) {
      if (rst.code === 1) {
        for (let d in rst.data) {
          let index = -1
          for (let i in this.ryjslist) {
            if (rst.data[d].id === this.ryjslist[i].id) {
              index = i
              break
            }
          }
          if (index !== -1) {
            this.$set(this.ryjslist, index, rst.data[d])
          }
        }
        this.$message.success('操作成功')
      } else {
        this.$message.error(rst.msg)
      }
    }
  }
}
</script>
