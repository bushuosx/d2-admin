<template>
  <el-form ref="ryzgedit" :rules="rules" :model="ryzg" label-width="100px">
    <el-form-item label="专业类别" prop="zylbId">
      <el-select v-model="ryzg.zylbId" filterable>
        <el-option v-for="item in zylblist" :key="item.id" :label="formartZYLB(item)" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="获得时间" prop="zgsj">
      <el-date-picker v-model="ryzg.zgsj"></el-date-picker>
    </el-form-item>
    <el-form-item label="证书编码" prop="zgzsbm">
      <el-input v-model="ryzg.zgzsbm"></el-input>
    </el-form-item>
    <el-form-item label="证明文件" prop="fileIdList">
      <file-upload @file-changed="handleFileChanged"></file-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import helper from '../helper/index.js'
export default {
  components: {
    'file-upload': () => import('@/components/fast-upload')
  },
  props: {
    zylblist: {
      type: Array
    },
    ryzg: {
      type: Object,
      default () {
        return {
          zcLevel: null,
          zylbId: null,
          zgsj: new Date(),
          zgzsbm: '',
          // files: [{ fileInfo: { id: null } }],
          fileIdList: []
        }
      }
    }
  },
  data () {
    const maxDate = Date.now() - 1
    const validateDate = (rule, value, callback) => {
      if (value && value > maxDate) {
        callback(new Error('时间有误'))
      } else {
        callback()
      }
    }
    // const validatezylb = (rule, value, callback) => {
    //   if (!value || !value.id) {
    //     callback(new Error('请选择职称的专业类别'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      ...helper,
      rules: {
        zylbId: [
          { required: true, message: '请选择专业类别', trigger: 'change' }
        ],
        zgsj: [
          { required: true, validator: validateDate, trigger: 'change' }
        ],
        zgzsbm: [
          { required: true, message: '请输入证书编码', trigger: 'change' }
        ],
        fileIdList: [
          { required: true, message: '请上传证明文件', trigger: 'change' }
        ]
      }
    }
  },
  // created () {
  //   zylbapi.getall().then(res => {
  //     if (res.code === 1) {
  //       this.zylblist = res.data
  //     }
  //   })
  // },
  methods: {
    handleFileChanged (val) {
      this.ryzg.fileIdList = val
    },
    handleSave () {
      this.$refs['ryzgedit'].validate((valid) => {
        if (valid) {
          this.$emit('edit-save', this.ryzg)
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.$emit('edit-cancel')
    }
  }
}
</script>
