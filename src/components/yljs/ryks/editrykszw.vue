<template>
  <div>
    <el-form v-if="editRY"
             :model="editRY">
      <el-form-item label="姓名">
        <div>{{editRY.xm}}</div>
      </el-form-item>
      <el-form-item label="工号">
        <div>{{editRY.gh}}</div>
      </el-form-item>
      <el-form-item label="科室">
        <el-select v-model="editRY.selectedKS"
                   placeholder="请选择">
          <el-option v-for="item in editRY.ksList"
                     :key="item.id"
                     :label="item.mc"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职务">
        <el-select v-model="editRY.selectedZW"
                   placeholder="请选择">
          <el-option v-for="item in zwList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button @click="handleSave"
                 type="primary">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form>
    <div v-else>
      <span>暂无信息</span>
    </div>
  </div>
</template>

<script>
const zwList = [{ name: '科主任', value: 20 }, { name: '副主任', value: 21 }, { name: '无', value: 0 }]
export default {
  props: {
    focusRY: Object
  },
  watch: {
    focusRY: { handler: function (n) {
      if (!n) {
        this.editRY = null
      } else {
        this.editRY = { selectedKS: '',
          selectedZW: this.focusRY.profile ? this.focusRY.profile.zw : 0,
          ...this.focusRY }
      }
    },
    immediate: true
    }
  },
  data () {
    return {
      editRY: null,
      zwList: zwList
    }
  },
  methods: {
    handleSave () {
      if (!this.editRY || !this.editRY.selectedZW || !this.editRY.selectedKS) {
        this.$message.error('选择的数据不正确')
        return
      }
      this.$emit('edit-save', { ksid: this.editRY.selectedKS, ryid: this.editRY.id, zw: this.editRY.selectedZW })
    },
    handleCancel () {
      this.$emit('edit-cancel')
    }
  }
}
</script>
