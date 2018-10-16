<template>
  <div>
    <el-form v-if="isKSManager || isMe || isApproved" label-width="120px" size="small">
      <el-form-item label="职称级别">
        <strong v-if="ryzc.zcLevel">{{formartZcLevel(ryzc.zcLevel)}}</strong>
      </el-form-item>
      <el-form-item label="专业">
        <strong>{{ryzc.zylb.mc}}</strong>
      </el-form-item>
      <el-form-item label="年资">
        <strong>{{formartNZ(ryzc.zcsj)}}</strong>
      </el-form-item>
      <el-form-item label="职称获得时间">
        <strong>{{formartDate(ryzc.zcsj)}}</strong>
      </el-form-item>
      <el-form-item label="证书编码">
        <strong>{{ryzc.zcbm}}</strong>
      </el-form-item>
      <el-form-item label="证明文件">
        <file-list :filelist="ryzc.files" filearea="ryzc"></file-list>
      </el-form-item>
      <template v-if="isKSManager && needKjsh">
        <el-form-item label="审核理由：">
          <el-input v-model="reason"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleApprove">审核通过</el-button>
          <el-button type="warning" @click="handleReject">驳回</el-button>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="审核意见">
          <el-tag v-if="ryzc.kjshInfo.operateReason" type="warning">{{ryzc.kjshInfo.operateReason}}</el-tag>
        </el-form-item>
        <el-form-item label="审核人">
          <strong>{{ryzc.kjshInfo.operatorName}}</strong>
        </el-form-item>
        <el-form-item label="科室审核时间">
          <strong>{{formartDate(ryzc.kjshInfo.operateTime)}}</strong>
        </el-form-item>
      </template>
      <el-form-item v-if="isMe">
        <template v-if="needCommit">
          <el-button @click="handleCommit">点击提交信息，并等待科室审核</el-button>
          <el-button @click="handleEdit">重新编辑此档案</el-button>
        </template>
        <el-button v-else-if="needReedit" @click="handleReedit" type="warning" plain>已被驳回，点击撤回重新编辑</el-button>
      </el-form-item>
    </el-form>
    <div style="text-align:right">
      <el-button @click="handleCancel">关闭</el-button>
    </div>
  </div>
</template>

<script>
import helper from '../helper/index.js'
import user from '@/libs/util.user.js'
import ryzcapi from '@/api/yljs/ryzc'
export default {
  props: {
    ryzc: {
      type: Object
    },
    isKSManager: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      reason: null
    }
  },
  components: {
    'file-list': () => import('../filelist')
  },
  computed: {
    isMe () {
      // console.log(this.ryzc)
      // console.log(user)
      // debugger
      return !!this.ryzc && this.ryzc.ryProfileID === user.profileId
    },
    needCommit () {
      return !!this.ryzc && !!this.ryzc.kjshInfo && this.ryzc.kjshInfo.operateCode === 0
    },
    needKjsh () {
      return !!this.ryzc && !!this.ryzc.kjshInfo && this.ryzc.kjshInfo.operateCode === 1
    },
    isApproved () {
      return !!this.ryzc && !!this.ryzc.kjshInfo && this.ryzc.kjshInfo.operateCode === 2
    },
    needReedit () {
      return !!this.ryzc && !!this.ryzc.kjshInfo && this.ryzc.kjshInfo.operateCode === 3
    }
  },
  methods: {
    ...helper,
    handleCancel () {
      this.$emit('detail-cancel')
    },
    handleApprove () {
      ryzcapi.approvekjsh(this.ryzc.id, this.reason).then(res => {
        if (res.code === 1) {
          this.emitUpdate(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
      this.reason = null
    },
    handleReject () {
      if (!this.reason) {
        this.$message.warning('请输入驳回理由')
        return false
      }

      ryzcapi.rejectkjsh(this.ryzc.id, this.reason).then(res => {
        if (res.code === 1) {
          this.emitUpdate(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
      this.reason = null
    },
    handleCommit () {
      ryzcapi.commit(this.ryzc.id).then(res => {
        if (res.code === 1) {
          this.emitUpdate(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleReedit () {
      ryzcapi.reedit(this.ryzc.id).then(res => {
        if (res.code === 1) {
          this.emitUpdate(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    emitUpdate (val) {
      this.$emit('detail-update', val)
    },
    handleEdit () {
      this.$emit('detail-edit')
    }
  }
}
</script>
