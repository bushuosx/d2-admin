<template>
  <d2-container>
    <el-card v-loading='loading'>
    <div slot="header">
      <h3>人员技术</h3>
      <div>以下是科室人员的技术授权申请</div>
    </div>
      <ryjs-table v-on:ryjs-changed="handleRyjsChanged" v-on:selection-changed="selectedChange" :ryjslist="ryjslist" :options="{showry:true}"></ryjs-table>
      <div v-if="isKjManager || isYjManager" style="margin-top:10px">
        <el-button :disabled='anySelected !== true' @click="handleResolveAll" type="primary" plain>批量通过</el-button>
        <el-button :disabled='anySelected !== true' @click="handleRejectAll" type="warning" plain>批量拒绝</el-button>
      </div>
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
  name: 'yljs-ryjs-listbyks',
  components: {
    'ryjs-table': () => import('@/components/yljs/ryjstable'),
    'my-pagination': () => import('@/components/MyPagination')
  },
  props: {
    ksid: String
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
    isKjManager () {
      return user.hasRoles([user.Roles.科级审核]) && user.ksid === this.ksid
    },
    isYjManager () {
      return user.hasRoles([user.Roles.院级审核])
    }
  },
  created () {
    // fetch未审核人员
    this.fetchData(1)
  },
  methods: {
    fetchData (val) {
      this.pageIndex = val
      if (!this.isKjManager) {
        this.$message.error('没有此权限')
        return
      }

      this.loading = true
      ryjsapi.getneedkjsh(this.ksid, val).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ryjslist = res.data
        } else if (res.code === 2) {
          this.$message.warning('目前没有新的申请')
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
    handleResolveAll () {
      if (this.anySelected) {
        this.approvekjsh(this.getSelectedId())
      }
    },
    handleRejectAll () {
      if (this.anySelected) {
        this.rejectkjsh(this.getSelectedId())
      }
    },
    // processResponse (res) {
    //   this.loading = false
    //   if (res.code === 1) {
    //     this.$message.success('审核完成')
    //     let response = res.data
    //     if (response !== null && response !== undefined && response.length) {
    //       for (let i in response) {
    //         let index = -1
    //         for (let j in this.ryjslist) {
    //           if (this.ryjslist[j].id === response[i].id) {
    //             index = j
    //             break
    //           }
    //         }
    //         if (index !== -1) {
    //           this.ryjslist.slice(index, 1)
    //         }
    //       }
    //     }
    //   } else {
    //     this.$message.error(res.msg)
    //   }
    // },
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

        // let index = -1
        // for (let i in this.ryjslist) {
        //   if (rowid === this.ryjslist[i].id) {
        //     index = i
        //     break
        //   }
        // }
        // if (index !== -1) {
        //   this.$set(this.ryjslist, index, rst.data[0])
        // }
        this.$message.success('操作成功')
      } else {
        this.$message.error(rst.msg)
      }
    }
  }
}
</script>
