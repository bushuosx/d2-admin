<template>
  <d2-container>
    <div>创建入科申请</div>
    <div>
      <span>申请加入的科室：</span>
      <el-select v-model="ksid" filterable placeholder="请选择要加入的科室">
        <el-option v-for="item in kslist" :key="item.id" :label="item.mc" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div><span>入科理由：</span>
      <el-input v-model="reason" placeholder="请输入内容"></el-input>
    </div>
    <div>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </d2-container>
</template>

<script>
import ksapi from '@/api/yljs/ks'
import ryksapi from '@/api/yljs/ryks'
export default {
  name: 'yljs-ryks-create',
  data () {
    return {
      kslist: [],
      ksid: null,
      reason: null
    }
  },
  created () {
    // fetch data
    ksapi.getallks().then(res => {
      if (res.code === 1) {
        this.kslist = res.data
      } else {
        this.$message({ message: res.msg, type: 'error' })
      }
    })
  },
  methods: {
    submit () {
      if (this.ksid === null || this.ksid === undefined || this.ksid === '') {
        this.$message({ message: '请选择一个科室', type: 'error' })
      } else {
        ryksapi.createryks(this.ksid, this.reason).then(res => {
          if (res.code === 1) {
            this.$message({ message: '申请成功，等待审核', type: 'success' })
            this.$router.replacePlus({ name: 'yljs-ry-ks' })
          } else {
            this.$message({ message: res.msg, type: 'error' })
          }
        }
        )
      }
    }
  }
}
</script>
