<template>
  <div>
    <h4>技术选择器</h4>
    <div style="margin-top:10px">
      <el-row style="margin-top:6px">
        <el-col style="margin-right:6px" :span="6">
          <el-input @change="filterjs" v-model="jsfilter.mc" placeholder="输入技术名称" clearable>
            <span slot="prepend">按名称</span>
          </el-input>
        </el-col>
        <el-col style="margin-right:6px" :span="6">
          <el-input v-model="jsfilter.bm" placeholder="输入技术编码" clearable>
            <span slot="prepend">按编码</span>
          </el-input>
        </el-col>
        <el-col style="margin-right:6px" :span="6">
          <el-input v-model="jsfilter.dj" placeholder="输入技术等级" clearable>
            <span slot="prepend">按等级</span>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-row style="margin-top:10px">
      <el-col :span="12">
        <div style="text-align: center">尚未申请的技术</div>
        <div>
          <div v-for="js in jslist" v-show="!js.hidden" v-bind:key="js.id">
            <span><input type="checkbox" v-model="js.checked" @change="changeselect(js,$event)"></span>
            <span>{{js.mc}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="margin-left:16px">
        <div style="text-align: center">准备申请的技术</div>
        <el-table size="mini" border :data="selectedjslist">
          <el-table-column width="40">
            <template slot-scope="scope">
              <span>
                <i class="el-icon-close removeselected" @click="removeselected(scope.row,scope.$index)"></i>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="技术名称" sortable prop="mc">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    jslist: Array
  },
  computed: {
    jsidlist: () => {
      let rst = []
      this.selectedjslist.forEach(
        res => {
          if (res.id && res.id !== undefined) {
            rst.push(res.id)
          }
        }
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
    changeselect (key, event) {
      let checked = event.target.checked
      let index = -1
      for (let i = 0; i < this.selectedjslist.length; i++) {
        if (this.selectedjslist[i].id === key) {
          index = i
          break
        }
      }

      if (index === -1) {
        if (checked) this.selectedjslist.push(key)
      } else if (!checked) {
        this.selectedjslist.splice(index, 1)
      }
    },
    removeselected (r, index) {
      for (let i = 0; i < this.jslist.length; i++) {
        if (this.jslist[i].id === r.id) {
          this.jslist[i].checked = false
          break
        }
      }
      this.selectedjslist.splice(index, 1)
    },
    filterjs () {
      // debugger
      let mc = this.jsfilter.mc
      // let bm = this.jsfilter.bm
      // let dj = this.jsfilter.dj
      this.$props.jslist.forEach(js => {
        let show = true
        if (show && mc && mc !== '') {
          show = js.mc.indexOf(mc) !== -1
        }
        // if (show && bm && bm !== '') {
        //   show = js.bm.indexOf(bm) !== -1
        // }
        // if (show && dj && dj !== '') {
        //   show = js.dj === dj
        // }
        js.hidden = !show
      })
    }
  }
}
</script>

<style scope>
i.removeselected {
  display: block;
  font-size: 1em;
  color: #f56c6c;
}
</style>
