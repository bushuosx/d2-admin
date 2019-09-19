<template>
  <el-form ref="ryEditForm"
           :rules="rules"
           :model="ry"
           label-width="100px">
    <el-form-item label="姓名">
      <strong>{{ry.xm}}</strong>
    </el-form-item>
    <el-form-item label="科室">
      <span>{{formartKSList(ry.ksList)}}</span>
    </el-form-item>
    <el-form-item label="性别"
                  prop="xb">
      <el-select v-model="ry.profile.xb"
                 value-key="label">
        <el-option v-for="item in xbOptions"
                   :key="item.label"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="岗位"
                  prop="gw">
      <el-select v-model="ry.profile.gw"
                 value-key="label">
        <el-option v-for="item in gwOptions"
                   :key="item.label"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="禁用此账号"
                  prop="limited">
      <el-checkbox v-model="ry.banned"></el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import util from '@/libs/util.yljs.js'
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
      gwOptions: [
        { label: '医师', value: 1 },
        { label: '护士', value: 2 },
        { label: '技师', value: 3 },
        { label: '行政人员', value: 4 },
        { label: '后勤人员', value: 5 },
        { label: '医学实习生', value: 10 },
        { label: '进修医师', value: 11 },
        { label: '规培医师', value: 12 },
        { label: '护理实习生', value: 20 },
        { label: '进修护士', value: 21 },
        { label: '未知', value: 0 }
      ],
      xbOptions: [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
        { label: '未知', value: 0 }
      ],
      rules: {
        dj: [{ required: true, message: '等级为1-4', trigger: 'change' }],
        lb: [
          { required: true, message: '请输入类别', trigger: 'change' }
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
    formartKSList: util.formartKSList,
    formartGW: util.formartGW,
    handleSave () {
      this.$refs['ryEditForm'].validate((valid) => {
        if (valid) {
          this.$emit('edit-save', this.ry)
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
