<template>
  <div>
    <table class="ksryreporttable">
      <caption>医院人员信息完善情况报表</caption>
      <thead>
        <tr>
          <th>科室</th>
          <th>姓名</th>
          <th>已激活</th>
          <th>有档案信息</th>
          <th>有技术申请</th>
        </tr>
      </thead>
      <tbody>
        <template is='tr'
          v-for="(rept,index) in ksryreportlist">
          <tr :key="'rept1'+index">
            <td :rowspan="getksrycount(rept)+2">{{getksname(rept)}}</td>
          </tr>
          <tr v-for="(ry,i) in rept.ryList"
            :key="ry.xm+i">
            <td>{{ry.xm}}</td>
            <td>{{showrightlatter(ry.yjh)}}</td>
            <td>{{showrightlatter(ry.hasDocument)}}</td>
            <td>{{showrightlatter(ry.jsCount!==0)}}</td>
          </tr>
          <tr class="tj"
            :key="'rept2'+index">
            <td>{{getksrycount(rept)}}人</td>
            <td>{{getjhrycount(rept)}}人({{toPercent(getjhrycount(rept),getksrycount(rept))}})</td>
            <td>{{getdocrycount(rept)}}人({{toPercent(getdocrycount(rept),getksrycount(rept))}})</td>
            <td>{{getjsrycount(rept)}}人({{toPercent(getjsrycount(rept),getksrycount(rept))}})</td>
          </tr>
        </template>
        <tr class="qytj">
          <td>全院</td>
          <td>{{getqyrycount()}}人</td>
          <td>{{getqyjhcount()}}人({{toPercent(getqyjhcount(),getqyrycount())}})</td>
          <td>{{getqyhasdocument()}}人({{toPercent(getqyhasdocument(),getqyrycount())}})</td>
          <td>{{getqyhasjs()}}人({{toPercent(getqyhasjs(),getqyrycount())}})</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    ksryreportlist: Array
  },
  data () {
    return {

    }
  },
  methods: {
    clickRow (row) {
      this.$message.info(JSON.stringify(row))
    },
    getksname (rept) {
      return !!rept.ks && !!rept.ks.mc ? rept.ks.mc : '暂无科室'
    },
    getksrycount (rept) {
      return !rept || !Array.isArray(rept.ryList) ? 0 : rept.ryList.length
    },
    getjhrycount (rept) {
      if (!rept || !Array.isArray(rept.ryList)) return 0
      let rst = 0
      for (let i = 0; i < rept.ryList.length; i++) {
        if (rept.ryList[i].yjh === true) rst++
      }
      return rst
    },
    getdocrycount (rept) {
      if (!rept || !Array.isArray(rept.ryList)) return 0
      let rst = 0
      for (let i = 0; i < rept.ryList.length; i++) {
        if (rept.ryList[i].hasDocument === true) rst++
      }
      return rst
    },
    getjsrycount (rept) {
      if (!rept || !Array.isArray(rept.ryList)) return 0
      let rst = 0
      for (let i = 0; i < rept.ryList.length; i++) {
        if (rept.ryList[i].jsCount !== 0) rst++
      }
      return rst
    },
    showrightlatter (b) {
      if (b) { return '√' } else { return '' }
    },
    showHuiZong (rept) {
      return '科室：' + this.getksname(rept) + ',备案人数：' + this.getksrycount(rept) + ',已激活人数'
    },
    getqyrycount () {
      if (!Array.isArray(this.ksryreportlist)) return 0
      let count = 0
      for (let i = 0; i < this.ksryreportlist.length; i++) {
        count += this.getksrycount(this.ksryreportlist[i])
      }
      return count
    },
    getqyjhcount () {
      if (!Array.isArray(this.ksryreportlist)) return 0
      let count = 0
      for (let i = 0; i < this.ksryreportlist.length; i++) {
        count += this.getjhrycount(this.ksryreportlist[i])
      }
      return count
    },
    getqyhasdocument () {
      if (!Array.isArray(this.ksryreportlist)) return 0
      let count = 0
      for (let i = 0; i < this.ksryreportlist.length; i++) {
        count += this.getdocrycount(this.ksryreportlist[i])
      }
      return count
    },
    getqyhasjs () {
      if (!Array.isArray(this.ksryreportlist)) return 0
      let count = 0
      for (let i = 0; i < this.ksryreportlist.length; i++) {
        count += this.getjsrycount(this.ksryreportlist[i])
      }
      return count
    },
    toPercent (num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0%' : Math.round(num / total * 10000) / 100.00 + '%'
    }
  }
}
</script>

<style>
table.ksryreporttable tr:hover {
  background-color: #eaf2d3;
  cursor: pointer;
}

table.ksryreporttable {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  width: 100%;
  border-collapse: collapse;
}

table.ksryreporttable td,
table.ksryreporttable th {
  font-size: 1em;
  border: 1px solid #98bf21;
  padding: 3px 7px 2px 7px;
}

table.ksryreporttable th {
  font-size: 1.1em;
  text-align: left;
  padding-top: 5px;
  padding-bottom: 4px;
  background-color: #a7c942;
  color: #ffffff;
}

table.ksryreporttable caption {
  font-size: 2em;
  text-align: center;
  padding: 5px;
}

table.ksryreporttable tbody tr.tj {
  font: bold;
  font-size: 1.1em;
}

table.ksryreporttable tbody tr.qytj {
  font-size: 1.5em;
  color: #00ccff;
}
</style>
