<template>
  <d2-container v-loading="loading">
    <el-card>
      <h3 slot="header">科室信息一览</h3>
      <div>
        <el-row>
          <el-col :span="8">
            <div>
              <span>科室：{{ksInfo?ksInfo.mc:""}}</span>
            </div>
            <div>
              <span>人数：{{ksryCount}}</span>
            </div>
            <div>科室主任：<span>{{kzrInfo}}</span></div>
            <div v-if="fzrInfo">科室副主任：<span>{{fzrInfo}}</span></div>
          </el-col>
          <el-col :span="8">
            <el-button @click="handleShowJS"
                       type="primary"
                       plain>查看科室人员已授权技术</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card v-if="isksManager">
      <strong slot="header">管理</strong>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-badge :hidden="jscount === 0"
                    :value="jscount">
            <el-button @click="handleJSSH"
                       type="primary"
                       plain>审核技术授权</el-button>
          </el-badge>
        </el-col>
        <el-col :span="8">
          <el-badge :hidden="kscount === 0"
                    :value="kscount">
            <el-button @click="handleRKSH"
                       type="primary"
                       plain>审核入科申请</el-button>
          </el-badge>
        </el-col>
        <el-col :span="8">
          <el-badge :hidden="profilecount === 0"
                    :value="profilecount">
            <el-button @click="handleRYProfileKJSH"
                       type="primary"
                       plain>审核人员资料</el-button>
          </el-badge>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-card>人员
            <div v-if="ryList"
                 style="max-height: 400px;overflow-y: auto;">
              <!-- <el-table :data="ryList">
                <el-table-column prop="gh" label="工号"></el-table-column>
                <el-table-column prop="xm" label="姓名"></el-table-column>
              </el-table> -->
              <ry-table :ryList="ryList"
                        :options="{hideCounter:true}"></ry-table>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>职称
            <div v-if="Array.isArray(ryList)">
              <mypie :data="ryList"
                     :filter="zcfilter"
                     @click-pie="handClickPieOnZC"></mypie>
            </div>
            <div v-else>暂无数据</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>学历
            <div v-if="Array.isArray(ryList)">
              <mypie :data="ryList"
                     :filter="xlfilter"
                     @click-pie="handClickPieOnXL"></mypie>
            </div>
            <div v-else>暂无数据</div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-card>年龄<div>暂未设计</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>性别<div>暂未设计</div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :visible.sync="ryListDialogData.visible"
               :title="ryListDialogData.title + ' 人员列表'">
      <ry-table :ryList="ryListDialogData.ryList"
                :options="{hideActioner:true}"></ry-table>
    </el-dialog>
  </d2-container>
</template>

<script>
import userutil from '@/libs/util.user.js'
import ksapi from '@/api/yljs/ks'
import ryksapi from '@/api/yljs/ryks'
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
      },
      needkjshreport: null
    }
  },
  computed: {
    user () {
      return userutil(this.$store)
    },
    ksryCount () {
      if (!Array.isArray(this.ryList)) {
        return 0
      } else {
        return this.ryList.length
      }
    },
    isksManager () {
      if (!this.user) {
        return false
      }
      return this.user.hasAnyPermission([this.user.Permissions.科级审核], this.ksid)
    },
    jscount () {
      if (this.needkjshreport && this.needkjshreport.jscount) {
        return this.needkjshreport.jscount
      } else {
        return 0
      }
    },
    kscount () {
      if (this.needkjshreport && this.needkjshreport.kscount) {
        return this.needkjshreport.kscount
      } else {
        return 0
      }
    },
    profilecount () {
      if (this.needkjshreport && this.needkjshreport.profilecount) {
        return this.needkjshreport.profilecount
      } else {
        return 0
      }
    },
    kzrInfo () {
      if (!Array.isArray(this.ryList) || this.ryList.length === 0) {
        return null
      } else {
        let kzr = this.ryList.filter(v => v.zw === 20).map(v => v.xm)
        if (!Array.isArray(kzr) || kzr.length === 0) {
          return null
        } else {
          return kzr.join(',')
        }
      }
    },
    fzrInfo () {
      if (!Array.isArray(this.ryList) || this.ryList.length === 0) {
        return ''
      } else {
        let kzr = this.ryList.filter(v => v.zw === 21).map(v => v.xm)
        if (!Array.isArray(kzr) || kzr.length === 0) {
          return null
        } else {
          return kzr.join(',')
        }
      }
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
        } else if (res.code === 2) {
          this.ksInfo = res.data.ks
          this.$message.warning('此科室当前没有人员登记')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => { this.loading = false })

      this.fetchNeedKjsh()
    },
    fetchNeedKjsh () {
      if (this.isksManager) {
        this.needkjshreport = null
        ryksapi.getneedkjshcount(this.ksid).then(res => {
          if (res.code === 1) {
            this.needkjshreport = res.data
            // console.log(report)
          }
        })
      }
    },
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
      this.ryListDialogData.title = name
      this.ryListDialogData.ryList = this.ryList.filter(v => yljsHelper.formartZcLevel(v.zc) === name)
      this.ryListDialogData.visible = true
    },
    handleShowJS () {
      this.$router.push({ name: 'yljs-ryjs-listbyks', params: { ksid: this.ksid } })
    }
  }
}

</script>
