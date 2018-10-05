<template>
    <d2-container>
        <div slot="header">
            <h3>人员技术</h3>
            <div>以下是等待院级审核的技术授权申请</div>
        </div>
        <el-card v-loading='loading'>
            <ryjs-table v-on:ryjs-changed="handleRyjsChanged" v-on:selection-changed="selectedChange" :ryjslist="ryjslist" :options="{showry:true,showks:true}"></ryjs-table>
            <div v-if="isYjManager" style="margin-top:10px">
                <el-button :disabled='anySelected !== true' @click="handleResolveAll" type="primary" plain>批量通过</el-button>
                <el-button :disabled='anySelected !== true' @click="handleRejectAll" type="warning" plain>批量拒绝</el-button>
            </div>
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
    'ryjs-table': () => import('@/components/yljs/ryjstable')
  },
  props: {
    ksid: String
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
    },
    isYjManager () {
      return user.hasRoles([user.Roles.院级审核])
    }
  },
  created () {
    // fetch未审核人员
    if (!this.isYjManager) {
      this.$message.error('没有此权限')
      return
    }
    ryjsapi.getneedyjsh(this.ksid).then(res => {
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
  methods: {
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
