<template>
  <div>
    <el-form v-if="isKSManager || isMe || isApproved"
             label-width="120px"
             size="small">
      <el-form-item label="学历">
        <strong>{{formartXW(ryxw.xw)}}</strong>
      </el-form-item>
      <el-form-item label="年资">
        <strong>{{formartNZ(ryxw.xwsj)}}</strong>
      </el-form-item>
      <el-form-item label="职称获得时间">
        <strong>{{formartDate(ryxw.xwsj)}}</strong>
      </el-form-item>
      <el-form-item label="证书编码">
        <strong>{{ryxw.xwbm}}</strong>
      </el-form-item>
      <el-form-item label="证明文件">
        <file-list :filelist="ryxw.files"
                   filearea="ryxwfile"></file-list>
      </el-form-item>
      <template v-if="isKSManager && needKjsh">
        <el-form-item label="审核理由：">
          <el-input v-model="reason"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="handleApprove">审核通过</el-button>
          <el-button type="warning"
                     @click="handleReject">驳回</el-button>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="审核意见">
          <el-tag v-if="ryxw.kjshInfo.operateReason"
                  type="warning">{{ryxw.kjshInfo.operateReason}}</el-tag>
        </el-form-item>
        <el-form-item label="审核人">
          <strong>{{ryxw.kjshInfo.operatorName}}</strong>
        </el-form-item>
        <el-form-item label="科室审核时间">
          <strong>{{formartDate(ryxw.kjshInfo.operateTime)}}</strong>
        </el-form-item>
      </template>
      <el-form-item v-if="isMe">
        <template v-if="needCommit">
          <el-button @click="handleCommit">点击提交信息，并等待科室审核</el-button>
          <el-button @click="handleEdit">重新编辑此档案</el-button>
        </template>
        <el-button v-else-if="needReedit"
                   @click="handleReedit"
                   type="warning"
                   plain>已被驳回，点击撤回重新编辑</el-button>
        <strong v-else-if="needKjsh">等待科室审核</strong>
        <el-button v-if="!isApproved"
                   style="margin-left:20px"
                   @click="handleDelete"
                   type="danger"
                   size="small"
                   plain>删除此档案</el-button>
      </el-form-item>
    </el-form>
    <div style="text-align:right">
      <el-button @click="handleCancel">关闭</el-button>
    </div>
  </div>
</template>

<script>
import helper from '../helper/index.js'
// import user from '@/libs/util.user.js'
import ryxwapi from '@/api/yljs/ryxw'
export default {
  props: {
    ryxw: {
      type: Object
    },
    isKSManager: {
      type: Boolean,
      default: false
    },
    isMe: {
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
    // isMe () {
    //   // console.log(this.ryxw)
    //   // console.log(user)
    //   // debugger
    //   return !!this.ryxw && this.ryxw.ryProfileID === user.profileId
    // },
    needCommit () {
      return !!this.ryxw && !!this.ryxw.kjshInfo && this.ryxw.kjshInfo.operateCode === 0
    },
    needKjsh () {
      return !!this.ryxw && !!this.ryxw.kjshInfo && this.ryxw.kjshInfo.operateCode === 1
    },
    isApproved () {
      return !!this.ryxw && !!this.ryxw.kjshInfo && this.ryxw.kjshInfo.operateCode === 2
    },
    needReedit () {
      return !!this.ryxw && !!this.ryxw.kjshInfo && this.ryxw.kjshInfo.operateCode === 3
    }
  },
  methods: {
    ...helper,
    handleCancel () {
      this.$emit('detail-cancel')
    },
    handleApprove () {
      ryxwapi.approvekjsh(this.ryxw.id, this.reason).then(res => {
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

      ryxwapi.rejectkjsh(this.ryxw.id, this.reason).then(res => {
        if (res.code === 1) {
          this.emitUpdate(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
      this.reason = null
    },
    handleCommit () {
      ryxwapi.commit(this.ryxw.id).then(res => {
        if (res.code === 1) {
          this.emitUpdate(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleReedit () {
      ryxwapi.reedit(this.ryxw.id).then(res => {
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
    },
    handleDelete () {
      if (!!this.ryxw && !!this.ryxw.id) {
        ryxwapi.delete(this.ryxw.id).then(res => {
          if (res.code === 1) {
            this.$message.success('删除成功')
            this.$emit('detail-delete', res.data)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
}
</script>
