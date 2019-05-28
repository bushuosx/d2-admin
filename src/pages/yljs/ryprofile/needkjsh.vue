<template>
  <d2-container>
    <div slot="header"><strong>需要审核档案的人员</strong></div>
    <template v-if="ryList">
      <ry-table :ryList="ryList">
        <el-button slot="actioner"
                   slot-scope="scope"
                   @click="handClick(scope.ry.id)"
                   type="primary"
                   size="small"
                   plain>转至审核界面</el-button>
      </ry-table>
    </template>
    <div v-else>暂时没有需要审核的数据</div>
  </d2-container>
</template>

<script>
import ryksapi from '@/api/yljs/ryks'
export default {
  name: 'yljs-ryprofile-needkjsh',
  components: {
    'ry-table': () => import('@/components/yljs/rytable')
  },
  props: {
    ksid: String
  },
  data () {
    return {
      ryList: null,
      loading: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      ryksapi.getprofileneedkjsh(this.ksid).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ryList = res.data
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
      this.$router.push({ name: 'yljs-ryprofile-index', params: { ryid, ksid: this.ksid } })
    }
  }
}
</script>
