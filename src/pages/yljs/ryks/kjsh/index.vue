<template>
  <d2-container>
    <div slot="header">
      <h3>入科审核</h3>
      <div>以下是申请加入本科室，但目前还没有通过审核的人员</div>
    </div>
    <el-card v-loading='loading'>
      <el-table :data="rykslist" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="工号" prop="ry.gh"></el-table-column>
        <el-table-column label="姓名" prop="ry.xm"></el-table-column>
        <el-table-column v-if="isSuper" label="科室" prop="ks.mc"></el-table-column>
        <el-table-column label="申请理由" prop="createLog.operateReason"></el-table-column>
        <el-table-column label="申请时间" prop="createLog.operateTime"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button @click="handleResolve(scope.row)" type="primary">通过</el-button>
            <el-button @click="handleReject(scope.row)" type="error">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button :disabled='anySelected !== true' @click="handleResolveAll">批量通过</el-button>
        <el-button :disabled='anySelected !== true' @click="handleRejectAll">批量拒绝</el-button>
      </div>
    </el-card>
  </d2-container>
</template>

<script>
/**
 * 此页面需科级审核权限
 */
import ryksapi from '@/api/yljs/ryks'
import role from '@/libs/util.role.js'
export default {
  name: 'yljs-kjsh',
  props: {
    ksid: String
  },
  data () {
    return {
      loading: true,
      rykslist: null,
      multipleSelection: []
    }
  },
  computed: {
    isSuper () {
      return role.hasRoles(role.Roles.超级管理权限)
    },
    anySelected () {
      return this.multipleSelection !== null && this.multipleSelection !== undefined && this.multipleSelection.length > 0
    }
  },
  created () {
    // fetch未审核人员
    ryksapi.getneedkjsh(this.ksid).then(res => {
      this.loading = false
      if (res.code === 1) {
        this.rykslist = res.data
      } else if (res.code === 2) {
        this.$message.warning('目前没有新的入科申请')
      } else {
        this.$message.error(res.msg)
      }
    }).catch(() => {
      this.loading = false
    })
  },
  methods: {
    handleResolve (row) {
      this.approvekjsh([row.id])
    },
    handleReject (row) {
      this.rejectkjsh([row.id])
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
    approvekjsh (rst) {
      this.loading = true
      ryksapi.approvekjsh(rst).then(this.processResponse).catch(() => { this.loading = false })
    },
    rejectkjsh (rst) {
      this.loading = true
      ryksapi.rejectkjsh(rst).then(this.processResponse).catch(() => { this.loading = false })
    },
    processResponse (res) {
      if (res.code === 1) {
        this.$message.success('审核完成')
        let response = res.data
        if (response !== null && response !== undefined && response.length) {
          for (let i in response) {
            let index = -1
            for (let j in this.rykslist) {
              if (this.rykslist[j].id === response[i]) {
                index = j
              }
            }
            if (index !== -1) {
              this.rykslist.slice(index, 1)
            }
          }
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    getSelectedId () {
      let rst = []
      for (let i in this.multipleSelection) {
        rst.push(this.multipleSelection[i].id)
      }
      return rst
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>
