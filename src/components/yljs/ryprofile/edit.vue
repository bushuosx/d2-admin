<template>
  <div>
    <el-form ref="editForm"
             :rules="rules"
             :model="ry"
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
          <el-button @click="photoDialogVisible=true"
                     type="primary"
                     plain>更改个人照片</el-button>
        </div>
      </el-form-item>

      <el-form-item label="性别"
                    prop="xb">
        <el-select v-model="ry.profile.xb"
                   value-key="label">
          <el-option v-for="item in getXBOptions"
                     :key="item.key"
                     :label="item.key"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位"
                    prop="gw">
        <el-select v-model="ry.profile.gw"
                   value-key="label">
          <el-option v-for="item in getGWOptions"
                     :key="item.key"
                     :label="item.key"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="身份证号"
                    prop="sfzh">
        <el-input v-model="ry.profile.sfzh"></el-input>
      </el-form-item>
      <el-form-item label="联系电话"
                    prop="phone">
        <el-input v-model="ry.profile.phone"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱"
                    prop="email">
        <el-input v-model="ry.profile.email"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   @click="handleSave">保存并提交</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="photoDialogVisible"
               title="上传人员照片"
               width="80%">
      <image-uploader @Upload-Success="handlePhotoUploadSuccess"></image-uploader>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/libs/util.yljs.js'
import filedownloadapi from '@/api/yljs/filedownload'

export default {
  props: {
    ry: {
      type: Object
    }
  },
  data () {
    // const validatezylb = (rule, value, callback) => {
    //   if (!value || !value.id) {
    //     callback(new Error('请选择职称的专业类别'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      photoDialogVisible: false,
      photoSize: {
        height: 413 / 2 + 'px',
        width: 295 / 2 + 'px'
      },
      rules: {
        dj: [{ required: true, message: '等级为1-4', trigger: 'change' }],
        lb: [
          { required: true, message: '请输入类别', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    getGWOptions () { return util.GetKeyValueArray(util.GWObject) },
    getXBOptions () { return util.GetKeyValueArray(util.XBObject) }
  },
  components: {
    'image-uploader': () => import('@/components/image-uploader')
  },
  methods: {
    getUrl: filedownloadapi.getShared,
    formartKSList: util.formartKSList,
    formartGW: util.formartGW,
    handleSave () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.$emit('edit-save', this.ry)
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.$emit('edit-cancel')
    },
    handlePhotoUploadSuccess (fileid, filedata) {
      this.photoDialogVisible = false
      // 更新ryprofile
      if (!!this.ry && !!this.ry.profile) {
        this.ry.profile.photo = { id: fileid, filedata }
      }
    }
  }
}
</script>
