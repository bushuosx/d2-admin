<template>
    <div>
        <template v-if="hasData">
            <div class="ryzcdata" v-for="item in ryzclist" :key="item.id" @click="handleClick(item)">
                <el-row>
                    <el-col :span="6">{{formartzylevel(item.zcLevel)}}</el-col>
                    <el-col :span="18">{{item.zylb?item.zylb.mc:""}}</el-col>
                </el-row>
                <el-row>
                    <el-col><span>获得时间：</span><span>{{formartDate(item.zcsj)}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col><span>资历：</span><span>{{getNZ(item.zcsj)}}</span></el-col>
                </el-row>
            </div>
        </template>
        <template v-else><span>无数据</span></template>
        <el-dialog :visible.sync="detailVisible" :ryzc="focusRyzc">
            <ryzc-detail></ryzc-detail>
        </el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    ryzclist: Array
  },
  data () {
    return {
      detailVisible: false,
      focusRyzc: null
    }
  },
  components: {
    'ryzc-detail': () => import('../ryzcdetail')
  },
  computed: {
    hasData () {
      return Array.isArray(this.ryzclist) && this.ryzclist.length > 0
    }
  },
  methods: {
    formartzylevel (level) {
      switch (level) {
        case 1:
          return '初级'
        case 2:
          return '中级'
        case 3:
          return '副高级'
        case 4:
          return '高级'
        default:
          return ''
      }
    },
    formartDate (date) {
      if (!date || !(date instanceof Date)) {
        return ''
      }
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`
    },
    getNZ (date) {
      if (!date || !(date instanceof Date)) {
        return ''
      }
      let val = new Date() - date
      if (val < 0) {
        return '时间有误'
      }
      const oneyear = 1000 * 60 * 60 * 24 * 365.25
      let year = Math.floor(val / oneyear)
      let month = Math.floor((val - year * oneyear) / (oneyear / 12))
      return year > 0 ? `${year} 年 ${month} 月` : `${month} 月`
    },
    handleClick (val) {
      this.focusRyzc = val
      this.detailVisible = true
    }
  }
}
</script>

<style>
div.ryzcdata {
  width: 200px;
  border-color: powderblue;
  border-style: solid;
  margin: 2px;
  padding: 2px;
  cursor: pointer;
}
</style>
