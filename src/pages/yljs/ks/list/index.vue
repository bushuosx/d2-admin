<template>
  <d2-container>
    <strong slot="header">所有科室列表</strong>
    <el-card>
      <div style="width:30%">
        <el-input v-model="ksname"
          placeholder="输入科室名称以过滤下列信息"
          :clearable="true">
        </el-input>
      </div>
      <kstable v-if="Array.isArray(filtedKsList)"
        :kslist="filtedKsList"></kstable>
    </el-card>
  </d2-container>
</template>

<script>
import ksapi from '@/api/yljs/ks'
export default {
  name: 'yljs-ks-list',
  components: {
    kstable: () => import('@/components/yljs/kstable')
  },
  data () {
    return {
      kslist: null,
      ksname: null,
      filtedKsList: null
    }
  },
  created () {
    ksapi.getallks().then(res => {
      if (res.code === 1) {
        this.kslist = res.data
        this.filteKSList()
      } else {
        this.$message.error(res.msg)
      }
    })
  },
  watch: {
    ksname: function () {
      this.filteKSList()
    }
  },
  methods: {
    filteKSList () {
      if (Array.isArray(this.kslist) && this.ksname) {
        this.filtedKsList = this.kslist.filter(v => (v.mc.indexOf(this.ksname) !== -1))
      } else {
        this.filtedKsList = this.kslist
      }
    }
  }
}
</script>
