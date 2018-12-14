<template>
  <el-form ref="ryxwedit"
           :rules="rules"
           :model="ryxw"
           label-width="100px">
    <el-form-item label="学位名称"
                  prop="xw">
      <el-select v-model="ryxw.xw"
                 filterable>
        <el-option v-for="item in xwOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="获得时间"
                  prop="xwsj">
      <el-date-picker v-model="ryxw.xwsj"></el-date-picker>
    </el-form-item>
    <el-form-item label="证书编码"
                  prop="xwbm">
      <el-input v-model="ryxw.xwbm"></el-input>
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
    ryxw: {
      type: Object,
      default () {
        return {
          xw: null,
          xwsj: new Date(),
          xwbm: '',
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
      xwOptions: [
        { label: '未知', value: 0 },
        // { label: '大专学位', value: 4 },
        { label: '学士学位', value: 5 },
        { label: '硕士学位', value: 6 },
        { label: '博士学位', value: 7 }
      ],
      rules: {
        xw: [{ required: true, message: '请选择学位', trigger: 'change' }],
        xwsj: [
          { required: true, validator: validateDate, trigger: 'change' }
        ],
        xwbm: [
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
      this.$set(this.ryxw, 'fileIdList', val)
      // this.ryxw.fileIdList = val
    },
    handleSave () {
      this.$refs['ryxwedit'].validate((valid) => {
        if (valid) {
          this.$emit('edit-save', this.ryxw)
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
