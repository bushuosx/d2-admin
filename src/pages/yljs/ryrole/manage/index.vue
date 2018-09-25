<template>
  <d2-container>
    <el-card>
      <div slot="header">人员信息</div>
      <div>
        <span>姓名：{{ryinfo.xm}}</span>
        <span>工号：{{ryinfo.gh}}</span>
      </div>
      <div>科室：
        <span></span>
      </div>
    </el-card>
    <el-card>
      <el-transfer v-model="selectedrole" :data="rolelist" :props="{key:'id',label:'roleName'}">

      </el-transfer>
      <div style="margin-top:10px">
        <el-button @click="saveroles" type="primary">保存</el-button>
      </div>
    </el-card>
  </d2-container>
</template>

<script>
import ryapi from '@/api/yljs/ry'
import roleapi from '@/api/yljs/role'

export default {
  props: { ryid: String },
  data () {
    return {
      ryinfo: { xm: '', gh: '' },
      rolelist: [],
      selectedrole: []
    }
  },
  created: function () {
    ryapi.getbyid(this.ryid).then(res => {
      if (res.code === 1) {
        this.ryinfo = res.data
      } else {
        this.$message({ message: res.msg, type: 'error' })
      }
    }).catch(() => {
      this.ryinfo = { xm: '', gh: '' }
    })

    roleapi.getall().then(res => {
      if (res.code === 1) {
        this.rolelist = res.data
      } else {
        this.$message({ message: res.msg, type: 'error' })
      }
    }).catch(() => {
      this.rolelist = []
    })
  },
  savaroles () {

  }
}
</script>
