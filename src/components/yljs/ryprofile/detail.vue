<template>
  <div>
    <el-form :model="ry"
             label-width="100px">
      <el-form-item label="姓名">
        <strong>{{ry.xm}}</strong>
      </el-form-item>
      <el-form-item label="科室">
        <span>{{formartKSList(ry.ksList)}}</span>
      </el-form-item>
      <el-form-item label="照片">
        <div>
          <template v-if="ry.profile && ry.profile.photo">
            <img :style="photoSize"
                 :src="ry.profile.photo.filedata ? ry.profile.photo.filedata : getUrl(ry.profile.photo.id)"
                 alt="正在加载照片">
          </template>
        </div>
      </el-form-item>
      <el-form-item label="性别">
        <span v-if="ry.profile">{{formartXB(ry.profile.xb)}}</span>
      </el-form-item>
      <el-form-item label="岗位">
        <span v-if="ry.profile">{{formartGW(ry.profile.xb)}}</span>
      </el-form-item>

      <el-form-item label="身份证号">
        <span v-if="ry.profile">{{ry.profile.sfzh}}</span>
      </el-form-item>
      <el-form-item label="联系电话">
        <span v-if="ry.profile">{{ry.profile.phone}}</span>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <span v-if="ry.profile">{{ry.profile.email}}</span>
      </el-form-item>

      <el-form-item label="审核状态">
        <span v-if="ry.profile && ry.profile.kjshInfo">{{formartSH(ry.profile.kjshInfo.operateCode)}}</span>
      </el-form-item>

      <el-form-item>
        <template v-if="showKJSH">
          <el-button type="primary"
                     @click="handleApprove">通过审核</el-button>
          <el-button type="warning"
                     @click="handleReject">驳回</el-button>
        </template>
        <template v-else-if="canReedit">
          <el-button type="danger"
                     @click="handleReedit">强制退回</el-button>
        </template>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import util from '@/libs/util.yljs.js'
import filedownloadapi from '@/api/yljs/filedownload'

export default {
  props: {
    ry: {
      type: Object
    },
    showKJSH: {
      type: Boolean
    },
    canReedit: {
      type: Boolean
    }
  },
  data () {
    return {
      photoSize: {
        height: 413 / 2 + 'px',
        width: 295 / 2 + 'px'
      }
    }
  },
  methods: {
    getUrl: filedownloadapi.getShared,
    formartKSList: util.formartKSList,
    formartGW: util.formartGW,
    formartXB: util.formartXB,
    formartSH: util.formartSH,
    handleApprove () {
      this.$emit('detail-approve', this.ry)
    },
    handleReject () {
      this.$emit('detail-reject', this.ry)
    },
    handleReedit () {
      this.$emit('detail-reedit', this.ry)
    },
    handleCancel () {
      this.$emit('detail-cancel')
    }
  }
}
</script>
