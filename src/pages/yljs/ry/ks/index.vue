<template>
  <d2-container>
    <el-card v-loading="loading">
      <div v-if="loading">等待加载信息……</div>
      <div v-else-if="err">
        <h3>科室信息加载出错，请稍后重试</h3>
        <div>{{err.message}}</div>
      </div>
      <div v-else-if="!myryks">
        <template v-if="myryks===null">
          <h2>你还不属于任何科室</h2>
          <el-button type="primary" @click="handleCreate">点击这里申请加入一个科室</el-button>
        </template>
      </div>
      <div v-else>
        <div>你已经申请加入科室：<el-button @click="toMyKS" type="primary" plain>{{myryks.ks.mc}}</el-button></div>
        <div>申请理由：{{myryks.createLog.operateReason}}</div>
        <div>申请时间：{{myryks.createLog.operateTime}}</div>
        <div v-if="myryks.kjshInfo.operateCode===0">
          <div>等待提交至科室审核</div>
          <div>
            <el-button @click="handleSubmit">直接提交</el-button>
            <el-button @click="handleEdit">重新编辑此申请</el-button>
          </div>
        </div>
        <div v-else-if="myryks.kjshInfo.operateCode===1">
          <div>等待科室管理员审核</div>
        </div>
        <div v-else-if="myryks.kjshInfo.operateCode===2">
          <div>审核已通过</div>
        </div>
        <div v-else-if="myryks.kjshInfo.operateCode===3">
          <div>申请已被驳回</div>
          <div>驳回理由：{{myryks.kjshInfo.operateReason}}</div>
          <div>操作人员：{{myryks.kjshInfo.operatorName}}</div>
          <div>操作时间：{{myryks.kjshInfo.operatorTime}}</div>
          <el-button @click="handleReEdit">点击此处修改申请</el-button>
        </div>
        <div v-else>出现错误，请联系网站管理员</div>
      </div>
    </el-card>

  </d2-container>
</template>

<script>
import ryksapi from '@/api/yljs/ryks'
export default {
  name: 'yljs-ry-ks',
  components: {
    mypie: () => import('@/components/mypievchart')
  },
  data () {
    return {
      myryks: undefined,
      loading: true,
      err: null
    }
  },
  created () {
    ryksapi.getmine().then(res => {
      this.loading = false
      if (res.code === 1) {
        this.myryks = res.data
        if (res.data.kjshInfo && res.data.kjshInfo.operateCode === 2) {
          // 已审核,跳转至相应科室
          this.toMyKS()
        } else {
          // 未提交、未审核、已驳回
        }
      } else if (res.code === 2) {
        // 还没有入科申请
        this.myryks = null
      } else {
        this.myryks = null
        this.$message.error(res.msg)
      }
    }).catch((err) => {
      this.loading = false
      this.err = err
    })
  },
  methods: {
    toMyKS () {
      if (!this.myryks || !this.myryks.ks || !this.myryks.id) {
        return false
      }
      this.$router.replacePlus({ name: 'yljs-ks-index', params: { ksid: this.myryks.ks.id } })
    },
    handleEdit () {
      this.$router.replacePlus({ name: 'yljs-ryks-edit', params: { ryksid: this.myryks.id } })
    },
    handleCreate () {
      this.$router.replacePlus({ name: 'yljs-ryks-create' })
    },
    handleReEdit () {
      ryksapi.reedit(this.myryks.id).then(res => {
        if (res.code === 1) {
          this.handleEdit()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSubmit () {
      ryksapi.commit(this.myryks.id).then(res => {
        if (res.code === 1) {
          this.myryks = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}

</script>
