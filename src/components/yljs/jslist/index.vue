<template>
  <div class="jslisttable">
    <div class="jslisttable caption" v-if="caption">
      <strong>{{caption}}</strong>
    </div>
    <div class="jslisttable head">
      <div class="jslisttable head row">
        <div class="jslisttable head cell"></div>
        <div class="jslisttable head cell">技术名称</div>
        <div class="jslisttable head cell">等级</div>
        <div class="jslisttable head cell">编码</div>
        <div class="jslisttable head cell">专业</div>
        <div class="jslisttable head cell">说明</div>
      </div>
    </div>
    <div class="jslisttable body">
      <template v-if="hasAnyData">
        <div class="jslisttable body row" v-for="js in jsList" :key="js.id" v-show="!js.hidden" @click="clickcheck(js)">
          <div class="jslisttable body cell"><input type="checkbox" v-model="js.checked"></div>
          <div class="jslisttable body cell">{{js.mc}}</div>
          <div class="jslisttable body cell">{{js.dj}}</div>
          <div class="jslisttable body cell">{{js.jsbm}}</div>
          <div class="jslisttable body cell">{{js.zylb}}</div>
          <div class="jslisttable body cell">{{js.sm}}</div>
        </div>
      </template>
      <template v-else>
        <div class="jslisttable body nodata">无可用数据</div>
      </template>
    </div>
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
.jslisttable.head.row{
  display: table-row
}

.jslisttable.body.cell {
  display: table-cell;
}
</style>
