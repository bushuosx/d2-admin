<template>
    <d2-container>
        <el-card>
            <div slot="header">
                <h2>步骤 1：选择要申请的技术</h2>
            </div>
            <div style="width:50%;">
                <el-input v-model="selectvalue" placeholder="请输入要搜索的内容" class="input-with-select">
                    <el-select v-model="selected" slot="prepend" placeholder="请选择">
                        <el-option label="加载全院技术" value="1"></el-option>
                        <el-option label="加载科室技术" value="2"></el-option>
                    </el-select>
                    <el-button @click="getjslist" slot="append" icon="el-icon-search" type="primary">查询</el-button>
                </el-input>
            </div>

            <jstransfer v-bind:jslist="jslist"></jstransfer>

            <el-button @click="testjs">性能测试</el-button>
        </el-card>
        <fast-upload>
            <h2 slot="title">步骤 2：选择申请上述技术授权的支撑文件</h2>
        </fast-upload>
        <el-card>
            <div slot="header">
                <h2>步骤 3：提交申请，并等待审核</h2>
            </div>
            <el-button type="primary">提交</el-button>
        </el-card>
    </d2-container>
</template>

<script>
import jstransfer from '@/components/yljs/js/jstransfer.1.vue'

export default {
  name: 'yljs-ryjs-create',
  components: { jstransfer },
  data () {
    return {
      selectvalue: null,
      selected: '1',
      jslist: [{ id: '1', mc: '胸腔闭式引流术', dj: 2, decs: 'xqbsyys', hidden: false }, { id: '2', mc: '导尿术', decs: 'dns', dj: 1, hidden: false }],
      ksjslist: null,
      yyjslist: null
    }
  },
  methods: {
    getjslist () {

    },
    testjs () {
      let count = this.jslist.length
      for (let i = 0; i < 10000; i++) {
        this.jslist.push({ id: count + i + 1, mc: '胸腔闭式引流术' + i, dj: 2, decs: 'xqbsyys', hidden: false })
      }
    }
  }
}
</script>

<style>
div.js-transfer div.el-transfer-panel {
  width: 300px;
}
</style>
