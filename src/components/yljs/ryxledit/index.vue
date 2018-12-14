<template>
  <el-form ref="ryxledit"
           :rules="rules"
           :model="ryxl"
           label-width="100px">
    <el-form-item label="学历名称"
                  prop="xl">
      <el-select v-model="ryxl.xl"
                 filterable>
        <el-option v-for="item in xlOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="获得时间"
                  prop="xlsj">
      <el-date-picker v-model="ryxl.xlsj"></el-date-picker>
    </el-form-item>
    <el-form-item label="证书编码"
                  prop="xlbm">
      <el-input v-model="ryxl.xlbm"></el-input>
    </el-form-item>
    <el-form-item label="证明文件"
                  prop="fileIdList">
      <file-upload @file-changed="handleFileChanged"></file-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import zylbapi from '@/api/yljs/zylb'
export default {
  components: {
    'file-upload': () => import('@/components/fast-upload')
  },
  props: {
    ryxl: {
      type: Object,
      default () {
        return {
          xl: null,
          xlsj: new Date(),
          xlbm: '',
          // files: [{ fileInfo: { id: null } }],
          fileIdList: []
        }
      }
    }
  },
  data () {
    const maxDate = Date.now() - 1
    const validateDate = (rule, value, callback) => {
      let errors = []
      if (value && value > maxDate) {
        errors.push(new Error('时间有误'))
      }
      callback(errors)
    }
    // const validatezylb = (rule, value, callback) => {
    //   if (!value || !value.id) {
    //     callback(new Error('请选择职称的专业类别'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      xlOptions: [
        { label: '未知', value: 0 },
        { label: '小学学历', value: 1 },
        { label: '初中学历', value: 2 },
        { label: '高中学历', value: 3 },
        { label: '大专学历', value: 4 },
        { label: '本科学历', value: 5 },
        { label: '硕士学历', value: 6 },
        { label: '博士学历', value: 7 }
      ],
      rules: {
        xl: [{ required: true, message: '请选择学历', trigger: 'change' }],
        xlsj: [
          { required: true, validator: validateDate, trigger: 'change' }
        ],
        xlbm: [
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
      this.$set(this.ryxl, 'fileIdList', val)
      // this.ryxl.fileIdList = val
    },
    handleSave () {
      this.$refs['ryxledit'].validate((valid) => {
        if (valid) {
          this.$emit('edit-save', this.ryxl)
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
