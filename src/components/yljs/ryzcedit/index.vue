<template>
    <el-form ref="ryzcedit" :rules="rules" :model="ryzc" label-width="100px">
        <el-form-item label="职称级别" prop="zcLevel">
            <el-select v-model="ryzc.zcLevel">
                <el-option label="无" value=0></el-option>
                <el-option label="初级" value=1></el-option>
                <el-option label="中级" value=2></el-option>
                <el-option label="副高级" value=3></el-option>
                <el-option label="高级" value=4></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="专业类别" prop="zylb">
            <el-select v-model="ryzc.zylb.id">
                <el-option v-for="item in zylblist" :key="item.id" :label="item.mc" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="获得时间" prop="zcsj">
            <el-date-picker v-model="ryzc.zcsj"></el-date-picker>
        </el-form-item>
        <el-form-item label="证书编码" prop="zcbm">
            <el-input v-model="ryzc.zcbm"></el-input>
        </el-form-item>
        <el-form-item label="证明文件" prop="file">
            <file-upload @file-changed="handleFileChanged"></file-upload>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  components: {
    'file-upload': () => import('@/components/fast-upload')
  },
  props: {
    ryzc: {
      type: Object,
      default () {
        return {
          zcLevel: null,
          zylb: { id: null },
          zcsj: new Date(),
          zcbm: '',
          fileidlist: []
        }
      }
    }
  },
  data () {
    const maxDate = new Date() - 1
    const validateDate = (rule, value, callback) => {
      if (value > maxDate) {
        callback(new Error('时间有误'))
      } else {
        callback()
      }
    }
    const validatezylb = (rule, value, callback) => {
      if (!value || !value.id) {
        callback(new Error('请选择职称的专业类别'))
      } else {
        callback()
      }
    }
    return {
      zylblist: [],
      rules: {
        zcLevel: [
          { required: true, message: '请选择职称级别', trigger: 'change' }
        ],
        zylb: [
          { required: true, validator: validatezylb, trigger: 'change' }
        ],
        zcsj: [
          { required: true, validator: validateDate, trigger: 'change' }
        ],
        zcbm: [
          { required: true, message: '请输入证书编码', trigger: 'change' }
        ],
        file: [
          { required: true, type: 'array', message: '请上传证明文件', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleFileChanged (val) {
      this.ryzc.fileidlist = val
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
