<template>
  <d2-container>
    <el-card v-loading='loading'>
      <div slot="header">
        <h3>人员技术授权信息</h3>
        <el-button v-if="isMe"
                   @click="handleCreate"
                   type="primary"
                   plain
                   size="small">申请新技术</el-button>
        <div v-else>以下是人员的技术授权</div>
      </div>
      <js-search @jssearch-click="handleSearchClick"
                 @jssearch-reset="handleSearchReset"></js-search>
      <ryjs-table v-on:ryjs-changed="handleRyjsChanged"
                  v-on:ryjs-deleted="handleRyjsDelete"
                  :ryjslist="ryjslist"
                  :options="{showry:!isMe}"></ryjs-table>
      <my-pagination :pageIndex="pageIndex"
                     @page-index-change="handlePageIndexChange"></my-pagination>
    </el-card>
  </d2-container>
</template>

<script>
/**
 * 此页面需科级审核权限
 */
import ryjsapi from '@/api/yljs/ryjs'
import userUtil from '@/libs/util.user.js'
export default {
  name: 'yljs-ryjs-listbyry',
  components: {
    'ryjs-table': () => import('@/components/yljs/ryjstable'),
    'my-pagination': () => import('@/components/MyPagination'),
    'js-search': () => import('@/components/yljs/jssearch')
  },
  props: {
    ryid: String
  },
  data () {
    return {
      loading: true,
      ryjslist: null,
      pageIndex: 1,
      pageSize: 50,
      option: {}
    }
  },
  computed: {
    user () {
      return userUtil(this.$store)
    },
    isMe () {
      return !!this.ryid && !!this.user && this.ryid === this.user.id
    }
  },
  created () {
    // fetch未审核人员
    this.fetchData()
  },
  watch: {
    ryid: function () {
      this.fetchData()
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      this.ryjslist = null

      this.option.ryid = this.ryid
      this.option.pageIndex = this.pageIndex
      this.option.pageSize = this.pageSize

      ryjsapi.search(this.option).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ryjslist = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handlePageIndexChange (val) {
      this.pageIndex = val
      this.fetchData()
    },
    handleSearchClick (val) {
      this.option = val
      this.fetchData()
    },
    handleSearchReset () {
      this.option = {}
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
    handleRyjsDelete (rowid, jsidlist) {
      for (let i in jsidlist) {
        let index = this.ryjslist.findIndex(v => v.id === jsidlist[i].id)
        if (index !== -1) {
          this.ryjslist.splice(index, 1)
        }
      }
    },
    handleCreate () {
      this.$router.push({ name: 'yljs-ryjs-create' })
    }
  }
}
</script>
