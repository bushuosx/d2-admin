<template>
    <d2-container>
        <el-card v-loading="loading">
            <div v-if="loading">等待加载信息……</div>
            <div v-else-if="err">
                <h3>科室信息加载出错，请稍后重试</h3>
                <div>{{err.message}}</div>
            </div>
            <div v-else-if="myryks===null">
                <h2>你还不属于任何科室</h2>
                <el-button type="primary">点击这里申请加入一个科室</el-button>
            </div>
            <div v-else>
                <div>你已经申请加入科室：<strong>{{myryks.ks.mc}}</strong></div>
                <div v-if="myryks.kjshinfo.operateCode===4">
                    <div>但申请已被驳回</div>
                    <div>驳回理由：{{myryks.ks.kjshinfo.operateReason}}</div>
                    <div>操作人员：{{myryks.ks.kjshinfo.operateName}}</div>
                    <div>操作时间：{{myryks.ks.kjshinfo.operateTime}}</div>
                    <el-button>点击此处修改申请</el-button>
                </div>
                <div v-else-if="myryks.kjshinfo.operateCode===2">
                    <div>等待科室管理员审核</div>
                </div>
                <div v-else>出现错误，请联系网站管理员</div>
            </div>
        </el-card>

    </d2-container>
</template>

<script>
import ryksapi from '@/api/yljs/ryks'
export default {
  components: {
    mypie: () => import('@/components/mypievchart')
  },
  data () {
    return {
      myryks: null,
      loading: true,
      err: null
    }
  },
  created () {
    ryksapi.getmine().then(res => {
      if (res.code === 1) {
        if (res.data.ks.operateCode === 3) {
          // 已审核,跳转至相应科室
          this.$router.replace({ name: 'yljs-ks-index', params: { ksid: res.data.ks.id } })
        } else {
          // 未审核
          this.myryks = res.data
        }
      } else if (res.code === 2) {
        // 还没有入科申请
        this.myryks = null
      } else {
        this.$message({ message: res.msg, type: 'error' })
      }
      this.loading = false
    }).catch((err) => {
      this.err = err
      this.loading = false
    })
  },
  methods: {
  }
}

</script>
