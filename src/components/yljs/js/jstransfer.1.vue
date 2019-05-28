<template>
  <div style="margin-top:10px">
    <strong>筛选器</strong>
    <div>
      <el-row style="margin-top:6px">
        <el-col :span="6">
          <el-input v-model="jsfilter.mc"
                    placeholder="输入技术名称"
                    clearable>
            <span slot="prepend">按名称</span>
          </el-input>
        </el-col>
        <el-col style="margin-left:6px"
                :span="6">
          <el-input v-model="jsfilter.bm"
                    placeholder="输入技术编码"
                    clearable>
            <span slot="prepend">按编码</span>
          </el-input>
        </el-col>
        <el-col style="margin-left:6px"
                :span="6">
          <el-input v-model="jsfilter.dj"
                    type="Number"
                    placeholder="输入技术等级"
                    clearable>
            <span slot="prepend">按等级</span>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-row style="margin-top:10px">
      <el-col :span="12">
        <div style="overflow:auto;max-height:600px;">
          <table class="jslisttable">
            <caption>尚未申请的技术
              <strong>{{jslist.length}}</strong>项</caption>
            <thead>
              <tr>
                <th></th>
                <th>技术名称</th>
                <th>编码</th>
                <th>等级</th>
                <th>限制性技术</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="js in filtedJsList"
                  v-bind:key="js.id"
                  v-show="!js.hidden"
                  @click="clickcheck(js)"
                  class="jslistrow">
                <td><input type="checkbox"
                         v-model="js.checked"></td>
                <td>{{js.mc}}</td>
                <td>{{js.bm}}</td>
                <td>{{js.dj}}</td>
                <td>
                  <el-tag type="warning"
                          v-if="js.limited===true">是</el-tag>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <jslisttable :jsList="filtedJsList"></jslisttable> -->
      </el-col>
      <el-col :span="10">
        <div style="margin-left:16px;overflow:auto;max-height:600px;">
          <div style="text-align: center;">准备申请的技术
            <strong>{{selectedjslist.length}}</strong>项</div>
          <el-table class="selectedtable"
                    size="mini"
                    border
                    :data="selectedjslist">
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-button class="removeselected"
                           type="danger"
                           size="mini"
                           icon="el-icon-close"
                           @click="removeselected(scope.row)"
                           circle></el-button>
              </template>
            </el-table-column>
            <el-table-column label="技术名称"
                             sortable
                             prop="mc">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    jslist: Array
  },
  components: {
    'jslisttable': () => import('@/components/yljs/jslist')
  },
  computed: {
    jsidlist: function () {
      let rst = []
      this.selectedjslist.forEach(
        res => {
          if (res.id && res.id !== undefined) {
            rst.push(res.id)
          }
        }
      )
      return rst
    },
    hasLimitedJS () {
      let i = this.selectedjslist.findIndex(x => x.limited === true)
      return i !== -1
    },
    filtedJsList: function () {
      return this.jslist.filter(v =>
        (!this.jsfilter.mc || (v.mc && v.mc.indexOf(this.jsfilter.mc) !== -1)) &&
        (!this.jsfilter.bm || (v.bm && v.bm.indexOf(this.jsfilter.bm) !== -1)) &&
        (!this.jsfilter.dj || v.dj === Number(this.jsfilter.dj))
      )
    }
  },
  data () {
    return {
      jsfilter: { mc: null, bm: null, dj: null },
      selectedjslist: []
    }
  },
  methods: {
    clickcheck (item) {
      if (item.checked !== true) {
        item.checked = true
      } else {
        item.checked = false
      }
      let checked = item.checked
      let index = -1
      for (let i = 0; i < this.selectedjslist.length; i++) {
        if (this.selectedjslist[i].id === item.id) {
          index = i
          break
        }
      }

      if (index === -1) {
        if (checked) this.selectedjslist.push(item)
      } else if (!checked) {
        this.selectedjslist.splice(index, 1)
      }
    },
    removeselected (r) {
      for (let i = 0; i < this.jslist.length; i++) {
        if (this.jslist[i].id === r.id) {
          this.jslist[i].checked = false
          break
        }
      }
      let removeindex = -1
      for (let i = 0; i < this.selectedjslist.length; i++) {
        if (this.selectedjslist[i].id === r.id) {
          removeindex = i
          break
        }
      }
      if (removeindex !== -1) this.selectedjslist.splice(removeindex, 1)
    },
    ResetSelected () {
      for (let i = 0; i < this.jslist.length; i++) {
        this.jslist[i].checked = false
      }
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>

<style>
button.el-button.removeselected {
  padding: 2px;
  margin: 0px;
}

div.el-table.selectedtable div.el-table__header-wrapper th {
  color: #409eff;
}

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
