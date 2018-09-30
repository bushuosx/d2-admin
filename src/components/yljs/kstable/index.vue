<template>
  <div>
    <el-table :data="kslist" style="width: 100%">
      <el-table-column>
        <template slot-scope="scope">
          <el-button size="mini" @click="showks(scope.row.id)">查看详细</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="mc" label="名称"></el-table-column>
      <el-table-column prop="bm" label="编码"></el-table-column>
      <template v-if="showzy===true">
        <el-table-column label="专业名称"><template slot-scope="scope"><span>{{scope.row.mc}}</span></template></el-table-column>
        <el-table-column label="专业编码"><template slot-scope="scope"><span>{{scope.row.bm}}</span></template></el-table-column>
      </template>
      <template v-if="showmanage===true">
        <el-table-column>
          <template slot-scope="scope">
            <el-button @click="rksh(scope.row.id)">入科审核</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import role from '@/libs/util.role.js'
export default {
  props: {
    kslist: Array,
    showzy: Boolean
  },
  computed: {
    showmanage () {
      console.log(role)
      return role.hasRoles([role.Roles.科级审核])
    }
  },
  methods: {
    showks (ksid) {
      if (ksid !== null && ksid !== undefined && ksid !== '') {
        this.$router.push({ name: 'yljs-ks', params: { ksid } })
      }
    },
    rksh (ksid) {
      this.$router.push({ name: 'yljs-ryks-kjsh', params: { ksid } })
    }
  }
}
</script>
