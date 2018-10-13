<template>
  <div>
    <el-table :data="kslist" style="width: 100%">
      <el-table-column label="名称">
        <template slot-scope="scope">
          <el-button @click="showks(scope.row.id)" type="primary" plain>{{scope.row.mc}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="bm" label="编码"></el-table-column>
      <template v-if="options && options.showzy===true">
        <el-table-column label="专业名称"><template slot-scope="scope"><span>{{scope.row.mc}}</span></template></el-table-column>
        <el-table-column label="专业编码"><template slot-scope="scope"><span>{{scope.row.bm}}</span></template></el-table-column>
      </template>
      <template v-if="isManager === true">
        <el-table-column label="管理功能">
          <template slot-scope="scope">
            <div>
              <el-button v-if="isKJSHManager(scope.row.id)" @click="toRksh(scope.row.id)" type="primary" size="mini" plain>人员入科审核</el-button>
            </div>
            <div>
              <el-button v-if="isKJSHManager(scope.row.id)" @click="toKJSH(scope.row.id)" type="primary" size="mini" plain>人员技术科级审核</el-button>
            </div>
            <div>
              <el-button v-if="isYJSHManager" @click="toYJSH(scope.row.id)" type="primary" size="mini" plain>人员技术院级审核</el-button>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import user from '@/libs/util.user.js'
export default {
  props: {
    kslist: Array,
    options: Object
  },
  computed: {
    isManager () {
      return user.hasRoles([user.Roles.院级审核]) || user.hasRoles([user.Roles.科级审核])
    },
    isYJSHManager () {
      console.log(user)
      return user.hasRoles([user.Roles.院级审核])
    }
  },
  methods: {
    isKJSHManager (ksid) {
      console.log(user)
      debugger
      if (!user.ksid) {
        return false
      }
      return ksid === user.ksid && user.hasRoles([user.Roles.科级审核])
    },
    showks (ksid) {
      if (ksid) {
        this.$router.push({ name: 'yljs-ks-index', params: { ksid } })
      }
    },
    toRksh (ksid) {
      this.$router.push({ name: 'yljs-ryks-kjsh', params: { ksid } })
    },
    toKJSH (ksid) {
      this.$router.push({ name: 'yljs-ryjs-kjsh', params: { ksid } })
    },
    toYJSH (ksid) {
      this.$router.push({ name: 'yljs-ryjs-yjsh', params: { ksid } })
    }
  }
}
</script>
