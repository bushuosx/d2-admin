<template>
  <div>
    <table class="jslisttable">
      <caption>{{caption}}
        <strong>{{jsList.length}}</strong>项</caption>
      <thead>
        <tr>
          <th>技术名称</th>
          <th>等级</th>
          <th>编码</th>
          <th>专业</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="hasAnyData">
          <tr v-for="js in jsList"
            v-bind:key="js.id"
            class="jslistrow">
            <td>{{js.mc}}</td>
            <td>{{js.dj}}</td>
            <td>{{js.jsbm}}</td>
            <td>{{js.zylb}}</td>
            <td>{{js.sm}}</td>
          </tr>
        </template>
        <template v-else>
          <strong>无有效数据</strong>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    jsList: {
      type: Array
    },
    caption: String
  },
  computed: {
    hasAnyData () {
      return Array.isArray(this.jsList) && this.jsList.length > 0
    }
  },
  methods: {
    clickcheck (js) {
      js.checked = !js.checked
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
</style>
