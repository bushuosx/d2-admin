<template>
  <d2-container>
    <el-card>
      <h3 slot="header">个人首页</h3>
      <div>
        <span>姓名：{{username}}</span>
        <div>
          <span>科室：XX</span>
        </div>
        <div>
          <a href="/">详细信息</a>
        </div>
      </div>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-card>科室人员</el-card>
        </el-col>
        <el-col :span="8">
          <el-card>年资</el-card>
        </el-col>
        <el-col :span="8">
          <el-card>学历</el-card>
        </el-col>
      </el-row>
    </el-card>
  </d2-container>
</template>
