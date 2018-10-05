<template>
    <d2-container>
        <el-card>
            <h3 slot="header">人员信息维护</h3>
        </el-card>
        <el-card>
            <div>一般信息展示</div>
        </el-card>
        <el-tabs type="border-card">
            <el-tab-pane>
                <span slot="label"><i class="el-icon-star-on"></i> 职称</span>
                <ryzc-edit></ryzc-edit>
            </el-tab-pane>
            <el-tab-pane label="资格">
                <ryzc-table :ryzclist="ryzclist"></ryzc-table>
            </el-tab-pane>
            <el-tab-pane label="学历">学历</el-tab-pane>
            <el-tab-pane label="学位">学位</el-tab-pane>
        </el-tabs>
    </d2-container>
</template>

<script>
export default {
  name: 'yljs-ry-profile',
  components: {
    'ryzc-edit': () => import('@/components/yljs/ryzcedit'),
    'ryzc-table': () => import('@/components/yljs/ryzctable')
  },
  data () {
    return {
      zclist: [],
      zglist: [],
      xllist: [],
      xwlist: [],
      ryzclist: [{
        id: '56771',
        zcLevel: 2,
        zcsj: new Date(2017, 1, 1),
        zylb: {
          id: 'aa',
          mc: '中医内科学'
        }
      }]
    }
  }
}
</script>
