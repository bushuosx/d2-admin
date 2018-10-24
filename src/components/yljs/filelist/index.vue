<template>
  <div>
    <div v-for="(file,index) in filelist" :key="file.id">
      <el-tag size="small" type="warning">{{index+1}}.</el-tag>
      <el-tag size="small"><a target="_blank" :href="geturl(file.id)">{{file.fileInfo.fileName}}</a></el-tag>
      <!-- <el-button @click="handleClick(file.id)" plain size="mini">{{file.fileInfo.fileName}}</el-button> -->
    </div>
  </div>
</template>

<script>
import filedownloadapi from '@/api/yljs/filedownload'
export default {
  props: {
    filelist: Array,
    filearea: String
  },
  methods: {
    geturl (key) {
      return filedownloadapi.fileServer + '/' + this.filearea + '/' + key
    },
    handleClick (fileid) {
      this.$router.push({ name: 'd2-container-frame', params: { src: this.geturl(fileid) } })
    }
  }
}
</script>
