<template>
  <d2-container>
    <el-card v-loading='loading'>
      <div slot="header">
        <h3>人员技术授权信息</h3>
        <el-button  v-if="isMe" @click="handleCreate" type="primary" plain size="small">申请新技术</el-button>
        <div v-else>以下是人员的技术授权</div>
      </div>
      <ryjs-table v-on:ryjs-changed="handleRyjsChanged" v-on:selection-changed="selectedChange" :ryjslist="ryjslist" :options="{showry:!isMe}"></ryjs-table>
      <my-pagination :pageIndex="pageIndex" @page-index-change="fetchData"></my-pagination>
    </el-card>
  </d2-container>
</template>

<script>
/**
 * 此页面需科级审核权限
 */
import ryjsapi from '@/api/yljs/ryjs'
import user from '@/libs/util.user.js'
export default {
  name: 'yljs-ryjs-listbyry',
  components: {
    'ryjs-table': () => import('@/components/yljs/ryjstable'),
    'my-pagination': () => import('@/components/MyPagination')
  },
  props: {
    ryid: String
  },
  data () {
    return {
      loading: true,
      ryjslist: null,
      multipleSelection: [],
      pageIndex: 1
    }
  },
  computed: {
    anySelected () {
      return this.multipleSelection !== null && this.multipleSelection !== undefined && this.multipleSelection.length > 0
    },
    isMe () {
      return !!this.ryid && this.ryid === user.userId
    }
  },
  created () {
    // fetch未审核人员
    this.fetchData(1)
  },
  watch: {
    ryid: function () {
      this.fetchData(1)
    }
  },
  methods: {
    fetchData (page) {
      this.pageIndex = page
      this.loading = true
      this.ryjslist = null
      this.multipleSelection = []

      let api
      if (this.isMe) {
        api = ryjsapi.getmine(page)
      } else {
        api = ryjsapi.getbyry(this.ryid, page)
      }
      api.then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ryjslist = res.data
        } else if (res.code === 2) {
          this.$message.warning('没有查询到更多数据')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
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
    },
    handleCreate () {
      this.$router.push({ name: 'yljs-ryjs-create' })
    }
  }
}
</script>
