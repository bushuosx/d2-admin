<template>
  <d2-container>
    <el-card v-loading="loading">
      <div v-if="loading">等待加载信息……</div>
      <div v-else-if="err">
        <h3>科室信息加载出错，请稍后重试</h3>
        <div>{{err.message}}</div>
      </div>
      <div v-else-if="!Array.isArray(ryksList) || ryksList.length===0">
        <span>你还不属于任何科室</span>
      </div>
      <div v-else>
        <div v-for="myryks in ryksList"
             :key="myryks.id"
             class="ksdiv">
          <div>你已经申请加入科室：<el-button @click="toMyKS(myryks.ks.id)"
                       type="primary"
                       plain>{{myryks.ks.mc}}</el-button>
          </div>
          <div>申请理由：{{myryks.createLog.operateReason}}</div>
          <div>申请时间：{{myryks.createLog.operateTime}}</div>
          <div v-if="myryks.kjshInfo.operateCode===0">
            <div>申请状态：等待提交至科室审核</div>
            <div>
              <el-button @click="handleSubmit(myryks.id)">直接提交</el-button>
              <el-button @click="handleEdit(myryks.id)">重新编辑此申请</el-button>
            </div>
          </div>
          <div v-else-if="myryks.kjshInfo.operateCode===1">
            <div>申请状态：等待科室管理员审核</div>
          </div>
          <div v-else-if="myryks.kjshInfo.operateCode===2">
            <div>申请状态：审核已通过</div>
          </div>
          <div v-else-if="myryks.kjshInfo.operateCode===3">
            <div>申请状态：申请已被驳回</div>
            <div>驳回理由：{{myryks.kjshInfo.operateReason}}</div>
            <div>操作人员：{{myryks.kjshInfo.operatorName}}</div>
            <div>操作时间：{{myryks.kjshInfo.operatorTime}}</div>
            <el-button @click="handleReEdit(myryks.id)">点击此处修改申请</el-button>
          </div>
          <div v-if="myryks.kjshInfo.operateCode!==2">
            <el-button @click="handleDelete(myryks.id)"
                       type="danger"
                       size="mini">点击删除此申请</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-button type="primary"
               @click="handleCreate">点击这里申请加入一个科室</el-button>

  </d2-container>
</template>

<script>
import ryksapi from '@/api/yljs/ryks'
export default {
  name: 'yljs-ry-ks',
  // components: {
  //   mypie: () => import('@/components/mypievchart')
  // },
  data () {
    return {
      ryksList: undefined,
      loading: true,
      err: null
    }
  },
  created () {
    ryksapi.getmine().then(res => {
      this.loading = false
      if (res.code === 1) {
        this.ryksList = res.data
        // if (res.data.kjshInfo && res.data.kjshInfo.operateCode === 2) {
        //   // 已审核,跳转至相应科室
        //   this.toMyKS()
        // } else {
        //   // 未提交、未审核、已驳回
        // }
      } else if (res.code === 2) {
        // 还没有入科申请
        this.ryksList = null
      } else {
        this.ryksList = null
        this.$message.error(res.msg)
      }
    }).catch((err) => {
      this.loading = false
      this.err = err
    })
  },
  methods: {
    toMyKS (ksid) {
      if (!ksid) {
        return false
      }
      this.$router.replacePlus({ name: 'yljs-ks-index', params: { ksid } })
    },
    handleEdit (ryksid) {
      if (!ryksid) {
        return false
      }
      this.$router.replacePlus({ name: 'yljs-ryks-edit', params: { ryksid } })
    },
    handleCreate () {
      this.$router.replacePlus({ name: 'yljs-ryks-create' })
    },
    handleReEdit (ryksid) {
      ryksapi.reedit(ryksid).then(res => {
        if (res.code === 1) {
          this.handleEdit(ryksid)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSubmit (ryksid) {
      ryksapi.commit(ryksid).then(res => {
        if (res.code === 1) {
          let i = this.ryksList.findIndex(v => v.id === res.data.id)
          if (i !== -1) {
            this.ryksList.splice(i, 1, res.data)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDelete (ryksid) {
      ryksapi.banmyryks(ryksid).then(res => {
        if (res.code === 1) {
          let index = this.ryksList.findIndex(v => v.id === res.data.id)
          if (index !== -1) {
            this.ryksList.splice(index, 1)
          }
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    }
  }
}
</script>

<style>
div.ksdiv {
  padding: 5px;
  max-width: 600px;
  border-style: solid;
  border-width: 2px;
  border-color: rgb(10, 177, 99);
}
</style>
