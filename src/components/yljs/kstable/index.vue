<template>
    <div>
        <el-table :data="kslist" style="width: 100%">
            <el-table-column>
                <template slot-scope="scope">
        <el-button
          size="mini"
          @click="showks(scope.row.id)">查看详细</el-button>
      </template>
            </el-table-column>
            <el-table-column prop="mc" label="名称"></el-table-column>
            <el-table-column prop="bm" label="编码"></el-table-column>
            <template v-if="options && options.zy">
                <el-table-column label="专业名称"><template slot-scope="scope"><span>{{scope.row.mc}}</span></template></el-table-column>
                <el-table-column label="专业编码"><template slot-scope="scope"><span>{{scope.row.bm}}</span></template></el-table-column>
            </template>
        </el-table>
    </div>
</template>

<script>
export default {
  props: {
    kslist: Array,
    options: Object
  },
  methods: {
    showks (ksid) {
      if (ksid !== null && ksid !== undefined && ksid !== '') {
        this.$router.push({ name: 'yljs-ks-index', params: { ksid } })
      }
    }
  }
}
</script>
