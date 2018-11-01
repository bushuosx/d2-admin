<template>
    <div>
        <el-tag v-if="options && options.hideCounter!==true">共 {{ryList ? ryList.length : 0}} 人</el-tag>
        <el-table :data="ryList" :size="size">
            <el-table-column v-if="options && options.showks===true" label="科室">
                <template slot-scope="scope">
                    <template v-if="scope.row.ryks && scope.row.ryks.ks">
                        <router-link :to="{name:'yljs-ks-index',params:{ksid:scope.row.ryks.ks.id}}">{{scope.row.ryks.ks.mc}}</router-link>
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="gh" label="工号"></el-table-column>
            <el-table-column prop="xm" label="姓名"></el-table-column>
            <el-table-column v-if="options && options.hideActioner!==true"
            style="min-width:120px;">
                <template slot-scope="scope">
                    <template v-if="options && options.hideDefaultActioner!==true">
                        <el-button size="mini" @click="showzl(scope.row)" type="primary" plain>资料</el-button>
                        <el-button size="mini" @click="showryjs(scope.row)" type="primary" plain>技术</el-button>
                    </template>
                    <slot name="actioner" :ry="scope.row"></slot>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  props: {
    ryList: Array,
    options: {
      type: Object,
      default: function () {
        return {
          hideCounter: false,
          showks: false,
          hideActioner: false,
          hideDefaultActioner: false,
          size: 'medium'
        }
      }
    }
  },
  computed: {
    size () {
      if (!this.options || !this.options.size) {
        return 'medium'
      }
      switch (this.options.size) {
        case 'small':
        case 'mini':
          return this.options.size
        default:
          return 'medium'
      }
    }
  },
  methods: {
    showryjs (row) {
      this.$router.push({ name: 'yljs-ryjs-listbyry', params: { ryid: row.id } })
    },
    showzl (row) {
      this.$router.push({ name: 'yljs-ryprofile-index', params: { ryid: row.id } })
    }
  }
}
</script>
