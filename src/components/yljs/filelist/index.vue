<template>
  <div>
    <div v-for="(file,index) in filelist" :key="file.id">
      <el-tag size="small" type="warning">{{index+1}}.</el-tag>
      <el-tag size="small"><a :href="geturl(file.id)">{{file.fileInfo.fileName}}</a></el-tag>
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
    }
  }
}
</script>
