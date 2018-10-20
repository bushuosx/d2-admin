<template>
  <d2-container v-loading="loading">
    <el-card>
      <h3 slot="header">科室信息一览</h3>
      <div>
        <div>
          <span>科室：{{ksInfo?ksInfo.mc:""}}</span>
        </div>
        <div>
          <span>人数：{{ksryCount}}</span>
        </div>
      </div>
    </el-card>
    <el-card v-if="isksManager">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-button @click="handleJSSH" type="primary" plain>审核技术授权</el-button>
        </el-col>
        <el-col :span="8">
          <el-button @click="handleRKSH" type="primary" plain>审核入科申请</el-button>
        </el-col>
        <el-col :span="8">
          <el-button @click="handleRYProfileKJSH" type="primary" plain>审核人员资料</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-card>人员
            <div v-if="ryList">
              <el-table :data="ryList">
                <el-table-column prop="gh" label="工号"></el-table-column>
                <el-table-column prop="xm" label="姓名"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>职称
            <div v-if="Array.isArray(ryList)">
              <mypie :data="ryList" :filter="zcfilter" @click-pie="handClickPieOnZC"></mypie>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>学历
            <div v-if="Array.isArray(ryList)">
              <mypie :data="ryList" :filter="xlfilter" @click-pie="handClickPieOnXL"></mypie>
            </div>
            <div>暂无数据</div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-card>年龄</el-card>
        </el-col>
        <el-col :span="8">
          <el-card>性别</el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :visible.sync="ryListDialogData.visible" :title="ryListDialogData.title + ' 人员列表'">
      <ry-table :ryList="ryListDialogData.ryList"></ry-table>
    </el-dialog>
  </d2-container>
</template>

<script>
import role from '@/libs/util.user.js'
import ksapi from '@/api/yljs/ks'
// import ryxlapi from '@/api/yljs/ryxl'
import yljsHelper from '@/libs/util.yljs.js'
export default {
  name: 'yljs-ks-index',
  props: {
    ksid: String
  },
  components: {
    mypie: () => import('@/components/mypievchart'),
    'ry-table': () => import('@/components/yljs/rytable')
  },
  data () {
    return {
      ksInfo: null,
      loading: false,
      ryList: null,
      // ryxlListOfKs: null,
      ryListDialogData: {
        visible: false,
        ryList: null
      }
    }
  },
  computed: {
    ksryCount () {
      if (!Array.isArray(this.ryList)) {
        return 0
      } else {
        return this.ryList.length
      }
    },
    isksManager () {
      if (!this.ksid) {
        return false
      }
      return role.hasRoles([role.Roles.科级审核]) && role.ksid === this.ksid
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    ksid: function () {
      this.fetchData()
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      this.ksInfo = null
      this.ryList = null
      ksapi.loadksry(this.ksid).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.ryList = res.data.ryList
          this.ksInfo = res.data.ks
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => { this.loading = false })
    },
    // fetchKsRyXl () {
    //   this.ryxlListOfKs = null
    //   return ryxlapi.getksryxl(this.ksid).then(res => {
    //     if (res.code === 1) {
    //       this.ryxlListOfKs = res.data
    //     }
    //   })
    // },
    zcfilter (item) {
      return { key: yljsHelper.formartZcLevel(item.zc), index: item.zc }
    },
    xlfilter (item) {
      return { key: yljsHelper.formartXL(item.xl), index: item.xl }
    },
    handleRKSH () {
      this.$router.push({ name: 'yljs-ryks-kjsh', params: { ksid: this.ksid } })
    },
    handleJSSH () {
      this.$router.push({ name: 'yljs-ryjs-kjsh', params: { ksid: this.ksid } })
    },
    handleRYProfileKJSH () {
      this.$router.push({ name: 'yljs-ryprofile-needkjsh', params: { ksid: this.ksid } })
    },
    handClickPieOnXL (name) {
      // this.$message.success(name)
      this.ryListDialogData.title = name
      this.ryListDialogData.ryList = this.ryList.filter(v => yljsHelper.formartXL(v.xl) === name)
      this.ryListDialogData.visible = true
    },
    handClickPieOnZC (name) {

    }
  }
}

</script>
