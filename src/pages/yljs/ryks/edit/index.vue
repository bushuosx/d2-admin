<template>
  <d2-container>
    <div>编辑入科申请</div>
    <div>
      <span>申请加入的科室：</span>
      <el-select v-model="ksid"
                 filterable
                 placeholder="请选择要加入的科室">
        <el-option v-for="item in kslist"
                   :key="item.id"
                   :label="item.mc"
                   :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div><span>入科理由：</span>
      <el-input v-model="reason"
                placeholder="请输入内容"></el-input>
    </div>
    <div>
      <el-button type="primary"
                 @click="submit">提交</el-button>
    </div>
  </d2-container>
</template>

<script>
import ksapi from '@/api/yljs/ks'
import ryksapi from '@/api/yljs/ryks'
export default {
  name: 'yljs-ryks-edit',
  props: {
    ryksid: String
  },
  data () {
    return {
      kslist: [],
      ksid: null,
      reason: null,
      ryks: null
    }
  },
  created () {
    // fetch data
    ryksapi.get(this.ryksid).then(res => {
      if (res.code === 1) {
        this.ryks = res.data
        if (res.data.kjshInfo.operateCode === 0) {
          ksapi.getallks().then(res2 => {
            if (res2.code === 1) {
              this.kslist = res2.data
              this.ksid = res.data.ks.id
            } else {
              this.$message({ message: res2.msg, type: 'error' })
            }
          })
        } else if (res.data.kjshInfo.operateCode === 1) {
          // 未审核，可以撤回
        } else {
          this.$message.error('此信息不允许编辑')
        }
      } else {
        this.$message.error(res.msg)
      }
    })
  },
  methods: {
    submit () {
      if (this.ksid === null || this.ksid === undefined || this.ksid === '') {
        this.$message({ message: '请选择一个科室', type: 'error' })
      } else {
        ryksapi.editryks(this.ryksid, this.ksid, this.reason).then(res => {
          if (res.code === 1) {
            this.$message.success('编辑成功，等待审核')
            this.$router.replacePlus({ name: 'yljs-ry-ks' })
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
}
</script>
