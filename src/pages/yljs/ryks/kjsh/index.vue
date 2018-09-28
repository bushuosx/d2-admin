<template>
    <d2-container>
        <div slot="header">
            <h3>入科审核</h3>
            <div>以下是申请加入本科室，但目前还没有通过审核的人员</div>
        </div>
        <el-card v-loading='loading'>
            <el-table :data="rykslist">
                <el-table-column label="工号" prop="ry.gh"></el-table-column>
                <el-table-column label="姓名" prop="ry.xm"></el-table-column>
                <el-table-column label="申请理由" prop="createLog.operateReason"></el-table-column>
                <el-table-column label="申请时间" prop="createLog.operateTime"></el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button @click="handleResolve(scope.row)" type="primary">通过</el-button>
                        <el-button @click="handleReject(scope.row)" type="error">拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </d2-container>
</template>

<script>
/**
 * 此页面需科级审核权限
 */
import ryksapi from '@/api/yljs/ryks'
export default {
  name: 'yljs-kjsh',
  props: {
    ksid: String
  },
  data () {
    return {
      loading: true,
      rykslist: null
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

    },
    handleReject (row) {

    }
  }
}
</script>
