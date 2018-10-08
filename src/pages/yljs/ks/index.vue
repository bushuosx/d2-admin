<template>
  <d2-container>
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
      </el-row>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-card>人员
            <div v-if="ksInfo && ksInfo.ryList">
              <el-table :data="ksInfo.ryList">
                <el-table-column prop="gh" label="工号"></el-table-column>
                <el-table-column prop="xm" label="姓名"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <div v-if="ksInfo && ksInfo.ryList">
            <el-card>职称
              <mypie :data="ksInfo.ryList" :filter="zcfilter"></mypie>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <el-card>学历
            <div v-if="ksInfo && ksInfo.ryList">
              <mypie :data="ksInfo.ryList" :filter="xlfilter"></mypie>
            </div>
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
  </d2-container>
</template>

<script>
import role from '@/libs/util.user.js'
import ksapi from '@/api/yljs/ks'
export default {
  name: 'yljs-ks-index',
  props: {
    ksid: String
  },
  components: {
    mypie: () => import('@/components/mypievchart')
  },
  data () {
    return {
      ksInfo: null
    }
  },
  computed: {
    ksryCount () {
      if (!this.ksInfo || !this.ksInfo.ryList || !Array.isArray(this.ksInfo.ryList)) {
        return 0
      } else {
        return this.ksInfo.ryList.length
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
    ksapi.loadksry(this.ksid).then(res => {
      if (res.code === 1) {
        // this.rylist = []
        // for (let i in res.data.ryList) {
        //   this.rylist.push(res.data.ryList[i].ry)
        // }
        this.ksInfo = res.data
      } else {
        this.$message.error(res.msg)
      }
    })
  },
  methods: {
    zcfilter (item) {
      switch (item.zc) {
        case 1:
          return { key: '初级', index: 1 }
        case 2:
          return { key: '中级', index: 2 }
        case 3:
          return { key: '高级', index: 3 }
        default:
          return { key: '其它', index: 4 }
      }
    },
    xlfilter (item) {
      switch (item.xl) {
        case 1:
          return { key: '专科', index: 1 }
        case 2:
          return { key: '本科', index: 2 }
        case 3:
          return { key: '硕士', index: 3 }
        default:
          return { key: '其它', index: 4 }
      }
    },
    handleRKSH () {
      this.$router.push({ name: 'yljs-ryks-kjsh', params: { ksid: this.ksid } })
    },
    handleJSSH () {
      this.$router.push({ name: 'yljs-ryjs-kjsh', params: { ksid: this.ksid } })
    }
  }
}

</script>
