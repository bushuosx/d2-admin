<template>
  <el-card>
    <div slot="header"><strong>人员技术授权信息</strong></div>
    <div v-if="options && options.showry===true">
      <el-row :gutter="10">
        <el-col :span="12"><label>科室：</label><span>{{ryjs.ry.ks}}</span></el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12"><label>姓名：</label><span>{{ryjs.ry.xm}}</span></el-col>
        <el-col :span="12"><label>工号：</label><span>{{ryjs.ry.gh}}</span></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12"><label>职称：</label><span>{{ryjs.ry.zc}}</span></el-col>
        <el-col :span="12"><label>职称获得时间：</label><span>{{ryjs.ry.zc}}</span></el-col>
      </el-row>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12"><label>技术名称：</label><span>{{ryjs.js.mc}}</span></el-col>
        <el-col :span="12"><label>技术编码：</label><span>{{ryjs.js.jsbm}}</span></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12"><label>技术等级：</label><span>{{ryjs.js.dj}}</span></el-col>
        <el-col :span="12"></el-col>
      </el-row>
    </div>
    <div>
      <div>支撑文件：</div>
      <file-list :filelist=ryjs.files filearea='ryjsfile'></file-list>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12"><label>申请理由：</label><span>{{ryjs.createLog.operateReason}}</span></el-col>
        <el-col :span="12"><label>申请时间：</label><span>{{ryjs.createLog.operateTime}}</span></el-col>
      </el-row>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12"><label>科室审核意见：</label><span>{{ryjs.kjshInfo.operateCode}}</span></el-col>
        <el-col :span="12"><label>科室审核意见说明：</label><span>{{ryjs.kjshInfo.operateReason}}</span></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12"><label>科室审核人：</label><span>{{ryjs.kjshInfo.operateName}}</span></el-col>
        <el-col :span="12"><label>科室审核时间：</label><span>{{ryjs.kjshInfo.operateTime}}</span></el-col>
      </el-row>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12"><label>医院审核意见：</label><span>{{ryjs.yjshInfo.operateCode}}</span></el-col>
        <el-col :span="12"><label>医院审核意见说明：</label><span>{{ryjs.yjshInfo.operateReason}}</span></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12"><label>医院审核人：</label><span>{{ryjs.yjshInfo.operateName}}</span></el-col>
        <el-col :span="12"><label>医院审核时间：</label><span>{{ryjs.yjshInfo.operateTime}}</span></el-col>
      </el-row>
    </div>

    <div style="margin-top:10px">
      <slot name="footer" :data="ryjs"></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    ryjs: Object,
    options: {
      type: Object,
      default: function () {
        return { showry: true }
      }
    }
  },
  components: {
    'file-list': () => import('../filelist')
  }
}
</script>
