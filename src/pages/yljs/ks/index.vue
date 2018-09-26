<template>
    <d2-container>
        <el-card>
            <h3 slot="header">科室信息一览</h3>
            <div>
                <div>
                    <span>科室：XX</span>
                </div>
                <div>
                    <span>人数：{{rylist.length}}</span>
                </div>
            </div>
        </el-card>
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-card>人员
                        <el-table :data="rylist">
                            <el-table-column prop="id" label="工号"></el-table-column>
                            <el-table-column prop="xm" label="姓名"></el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>职称
                        <ve-pie :data="zcData"></ve-pie>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>学历
                        <ve-pie :data="xlData"></ve-pie>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>年龄</el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>性别</el-card>
                </el-col>
            </el-row>
        </el-card>
    </d2-container>
</template>

<script>
export default {
  data () {
    return {
      rylist: [
        { id: 1, xm: '张三', xb: 1, xl: 2, zc: 3 },
        { id: 2, xm: '李四', xb: 1, xl: 2, zc: 2 },
        { id: 3, xm: '王花', xb: 2, xl: 3, zc: 1 },
        { id: 4, xm: '张三二', xb: 1, xl: 1, zc: 1 },
        { id: 5, xm: '李四二', xb: 1, xl: 2, zc: 2 },
        { id: 6, xm: '王花二', xb: 2, xl: 3, zc: 1 }
      ]
    }
  },
  computed: {
    zcData () {
      let rst = [{ zc: '初级', count: 0 }, { zc: '中级', count: 0 }, { zc: '高级', count: 0 }]
      for (let i in this.rylist) {
        switch (this.rylist[i].zc) {
          case 1:
            rst[0].count += 1
            break
          case 2:
            rst[1].count += 1
            break
          default:
            rst[2].count += 1
            break
        }
      }
      return {
        columns: ['zc', 'count'],
        rows: rst
      }
    },
    xlData () {
      return {
        columns: ['xl', 'id'],
        rows: this.rylist
      }
    }
  }

}
</script>
