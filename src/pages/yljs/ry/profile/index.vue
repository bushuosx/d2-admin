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
            </el-tab-pane>
            <el-tab-pane label="资格">资格</el-tab-pane>
            <el-tab-pane label="学历">学历</el-tab-pane>
            <el-tab-pane label="学位">学位</el-tab-pane>
        </el-tabs>
    </d2-container>
</template>

<script>
export default {
  name: 'yljs-ry-profile',
  data () {
    return {
      zclist: [],
      zglist: [],
      xllist: [],
      xwlist: []
    }
  }
}
</script>
