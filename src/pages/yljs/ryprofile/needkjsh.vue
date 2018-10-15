<template>
    <d2-container>
        <div slot="header"><strong>需要审核档案的人员</strong></div>
        <ry-table :rylist="rylist">
            <el-button slot="actioner" slot-scope="scope" @click="handClick(scope.ry.id)" type="primary" size="small" plain>转至审核界面</el-button>
        </ry-table>
    </d2-container>
</template>

<script>
import ryksapi from '@/api/yljs/ryks'
export default {
  components: {
    'ry-table': () => import('@/components/yljs/rytable')
  },
  props: {
    ryid: String
  },
  data () {
    return {
      rylist: null,
      loading: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      ryksapi.getprofileneedkjsh().then(res => {
        this.loading = false
        if (res.code === 1) {
          this.rylist = res.data
        } else if (res.code === 2) {
          this.$message.warning('本科室暂时没有人员资料需要审核')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handClick (ryid) {
      this.$router.push({ name: 'yljs-ryprofile-index', params: { ryid } })
    }
  }
}
</script>
