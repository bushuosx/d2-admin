<template>
  <div style="overflow:auto;max-height:600px;">
    <table class="jslisttable">
      <caption>科室人员资料完善情况报表</caption>
      <thead>
        <tr>
          <th>科室</th>
          <th>备案人数</th>
          <th>激活人数</th>
          <th>档案完善人数</th>
          <th>技术申请人数</th>
        </tr>
      </thead>
      <tbody>
        <template is='tr'
                  v-for="(rept,index) in ksryreportlist">
          <tr :key="index" >
           <td :rowspan="getksrycount(rept)+2">{{getksname(rept)}}</td>
          </tr>
          <tr v-for="(rp,i) in rept.ryList"
          :key="i">

          </tr>
        </template>

        <tr v-for="(rept,index) in ksryreportlist"
            v-bind:key="index"
            @click="clickRow(rept)">
          <td>{{getksname(rept)}}</td>
          <td>{{getksrycount(rept)}}</td>
          <td>{{getjhrycount(rept)}}</td>
          <td>{{getdocrycount(rept)}}</td>
          <td>{{getjhrycount(rept)}}</td>
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
    }
  }
}
</script>

<style>
table.jslisttable tr:hover {
  background-color: #eaf2d3;
  cursor: pointer;
}

table.jslisttable {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  width: 100%;
  border-collapse: collapse;
}

table.jslisttable td,
table.jslisttable th {
  font-size: 1em;
  border: 1px solid #98bf21;
  padding: 3px 7px 2px 7px;
}

table.jslisttable th {
  font-size: 1.1em;
  text-align: left;
  padding-top: 5px;
  padding-bottom: 4px;
  background-color: #a7c942;
  color: #ffffff;
}

table.jslisttable caption {
  font-size: 1.5em;
  text-align: center;
}
</style>
