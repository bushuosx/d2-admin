<template>
  <el-form ref="ryzcedit"
           :rules="rules"
           :model="ryzc"
           label-width="100px">
    <el-form-item label="职称级别"
                  prop="zcLevel">
      <el-select v-model="ryzc.zcLevel">
        <el-option v-for="item in zcLevelOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="专业类别"
                  prop="zylbId">
      <el-select v-model="ryzc.zylbId"
                 filterable>
        <el-option v-for="item in zylblist"
                   :key="item.id"
                   :label="formartZYLB(item)"
                   :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="获得时间"
                  prop="zcsj">
      <el-date-picker v-model="ryzc.zcsj"></el-date-picker>
    </el-form-item>
    <el-form-item label="证书编码"
                  prop="zcbm">
      <el-input v-model="ryzc.zcbm"></el-input>
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
import helper from '../helper/index.js'
export default {
  components: {
    'file-upload': () => import('@/components/fast-upload')
  },
  props: {
    zylblist: {
      type: Array
    },
    ryzc: {
      type: Object,
      default () {
        return {
          zcLevel: null,
          zylbId: null,
          zcsj: new Date(),
          zcbm: '',
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

    // const validateArray = (rule, value, callback) => {
    //   debugger
    //   if (!Array.isArray(value) || value.length === 0) {
    //     callback(new Error('证明文件不能为空'))
    //   } else {
    //     callback()
    //   }
    // }

    // const validatezylb = (rule, value, callback) => {
    //   if (!value || !value.id) {
    //     callback(new Error('请选择职称的专业类别'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      zcLevelOptions: [
        { label: '无', value: 0 },
        { label: '初级', value: 1 },
        { label: '中级', value: 2 },
        { label: '副高级', value: 3 },
        { label: '正高级', value: 4 }
      ],
      rules: {
        zcLevel: [
          { required: true, message: '请选择职称级别', trigger: 'change' }
        ],
        zylbId: [
          { required: true, message: '请选择职称的专业类别', trigger: 'change' }
        ],
        zcsj: [
          { required: true, validator: validateDate, trigger: 'change' }
        ],
        zcbm: [
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
    ...helper,
    handleFileChanged (val) {
      // this.ryzc.fileIdList = val
      this.$set(this.ryzc, 'fileIdList', val)

      // this.$refs['ryzcedit'].validate()
    },
    handleSave () {
      this.$refs['ryzcedit'].validate((valid) => {
        if (valid) {
          this.$emit('edit-save', this.ryzc)
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
