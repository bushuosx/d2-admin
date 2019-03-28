<template>
  <d2-container v-loading="loading">
    <template slot="header">
      <div><span>科室：</span></div>
    </template>
    <ry-table :ryList="ryList">
      <el-button v-if="isKSRoleManager"
        type="danger"
        slot="actioner"
        slot-scope="scope"
        @click="handleBan(scope.ry)"
        size="mini"
        plain>移除</el-button>
    </ry-table>
  </d2-container>
</template>

<script>
import ryksapi from '@/api/yljs/ryks'
import user from '@/libs/util.user.js'

export default {
  props: {
    ksid: String
  },
  components: {
    'ry-table': () => import('@/components/yljs/rytable')
  },
  computed: {
    isKSRoleManager () {
      return !!this.ksid && user.ksid === this.ksid && user.hasRoles([user.Roles.科室角色管理权限])
    }
  },
  data () {
    return {
      ryList: null,
      loading: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      ryksapi.getrybyks(this.ksid).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ryList = res.data
        } else {
          this.$messgae.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleBan (ry) {
      if (ry) {
        if (ry.id === user.userId) {
          this.$message.warning('不能移除自己')
          return
        }
        this.$prompt('此操作将从本科室中移除人员，若该人员有科室管理权限，将一并移除。请在下方输入操作原因：', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '请输入移除人员的原因',
          type: 'warning',
          center: true
        }).then(({ value }) => {
          this.loading = true
          ryksapi.ban([ry.id], value).then(res => {
            this.loading = false
            if (res.code === 1) {
              for (let i = 0; i < res.data.length; i++) {
                var index = this.ryList.findIndex((v) => {
                  return res.data[i].ryid && v.id === res.data[i].ryid
                })
                if (index !== -1) {
                  this.ryList.splice(index, 1)
                }
              }
              this.$messgae.success('移除成功')
            } else {
              this.$messgae.error(res.msg)
            }
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          })
        })
      }
    }
  }
}
</script>
