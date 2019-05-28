<template>
  <el-form ref="jsEditForm"
           :rules="rules"
           :model="js"
           label-width="100px">
    <el-form-item label="技术名称">
      <strong>{{js.mc}}</strong>
    </el-form-item>
    <el-form-item label="等级"
                  prop="dj">
      <el-select v-model="js.dj">
        <el-option v-for="item in djOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="专业类别"
                  prop="zyList">
      <el-select v-model="js.zylb"
                 value-key="id">
        <el-option v-for="item in zyList"
                   :key="item.id"
                   :label="item.mc"
                   :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="限制性技术"
                  prop="limited">
      <el-checkbox v-model="js.limited"></el-checkbox>
    </el-form-item>
    <el-form-item label="编码类别"
                  prop="lb">
      <el-input v-model="js.lb"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    js: {
      type: Object
    },
    zyList: {
      type: Array
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
      djOptions: [
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
        { label: '三级', value: 3 },
        { label: '四级', value: 4 }
      ],
      rules: {
        dj: [{ required: true, message: '等级为1-4', trigger: 'change' }]
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
    handleSave () {
      this.$refs['jsEditForm'].validate((valid) => {
        if (valid) {
          this.$emit('edit-save', this.js)
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
