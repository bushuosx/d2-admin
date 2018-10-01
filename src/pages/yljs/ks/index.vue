<template>
  <d2-container>
    <el-card>
      <h3 slot="header">科室信息一览</h3>
      <div>
        <div>
          <span>科室：我的科室</span>
        </div>
        <div>
          <span>人数：{{rylist.length}}</span>
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
            <el-table :data="rylist">
              <el-table-column prop="gh" label="工号"></el-table-column>
              <el-table-column prop="xm" label="姓名"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>职称
            <mypie :data="rylist" :filter="zcfilter"></mypie>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>学历
            <mypie :data="rylist" :filter="xlfilter"></mypie>
          </el-card>
        </el-col>
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
import ryksapi from '@/api/yljs/ryks'
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
      //   rylist: [
      //     { id: 1, xm: '张三', xb: 1, xl: 2, zc: 3 },
      //     { id: 2, xm: '李四', xb: 1, xl: 2, zc: 2 },
      //     { id: 3, xm: '王花', xb: 2, xl: 3, zc: 1 },
      //     { id: 4, xm: '张三二', xb: 1, xl: 1, zc: 1 },
      //     { id: 5, xm: '李四二', xb: 1, xl: 2, zc: 2 },
      //     { id: 6, xm: '王花二', xb: 2, xl: 3, zc: 1 }
      //   ],
      rylist: []
    }
  },
  created () {
    ryksapi.getbyks(this.ksid).then(res => {
      if (res.code === 1) {
        this.rylist = []
        for (let i in res.data) {
          this.rylist.push(res.data[i].ry)
        }
      } else {
        this.$messaga.error(res.msg)
      }
    })
  },
  computed: {
    isksManager () {
      if (!this.ksid) {
        return false
      }
      return role.hasRoles([role.Roles.科级审核]) && role.ksid === this.ksid
    }
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
      this.$router.push({ name: 'yljs-ryjs-listbyks', params: { ksid: this.ksid } })
    }
  }
}

</script>
