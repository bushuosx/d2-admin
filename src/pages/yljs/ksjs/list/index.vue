<template>
  <d2-container v-loading="loading">
    <el-card>
      <div>这里显示的是科室维护的技术数据，非科室人员实际拥有的技术</div>
      <jslistTable v-bind:jsList="jslist"
                   :showActioner="true">
        <el-button slot="actioner"
                   type="danger"
                   size="mini"
                   icon="el-icon-close"
                   slot-scope="scope"
                   @click="onDelete(scope.js)"></el-button>
      </jslistTable>
      <el-button type="primary"
                 @click="fetchData">刷新</el-button>
    </el-card>
  </d2-container>
</template>

<script>
import ksjsapi from '@/api/yljs/ksjs'

export default {
  name: 'yljs-ksjs-list',
  components: {
    'jslistTable': () => import('@/components/yljs/jslist')
  },
  props: {
    ksid: String
  },
  data () {
    return {
      jslist: [],
      loading: false
    }
  },
  created () {
    // fetch未审核人员
    this.fetchData()
  },
  methods: {
    fetchData () {
      if (this.loading) return

      this.loading = true

      ksjsapi.getksjslist(this.ksid).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.jslist = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        this.loading = false
        this.$message.error(err.message ? err.message : err)
      })
    },
    onDelete (js) {
      if (!js || !js.id) {
        this.$message.error('未知错误')
        return
      }

      this.$confirm('删除此技术？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ksjsapi.deleteksjs(this.ksid, [js.id]).then((res) => {
          if (!res || res.code !== 1) {
            this.$message.error(res.msg)
          } else {
            let index
            do {
              index = this.jslist.findIndex(v => v.id === js.id)
              if (index !== -1) {
                this.jslist.splice(index, 1)
              }
            } while (index !== -1)
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      })
    }
  }
}
</script>
