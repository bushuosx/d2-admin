<template>
  <div>
    <el-button size="small" type="primary" @click="add">选取文件</el-button>
    <input @change="change" ref="selectfiledialog" type="file" hidden/>
    <div class="fileselector" v-for="(item,index) in uploadfiles" v-bind:item="item" v-bind:key="item.key" v-bind:index="index">
      <span>{{item.file.name}} </span>
      <span v-if="item.reading">
        <i class="el-icon-loading" />文件准备中……</span>
      <el-button v-else size="mini" type="primary">
        <i class="el-icon-upload" />上传</el-button>
      <el-button size="mini" type="danger" @click="uploadfiles.splice(index, 1)">
        <i class="el-icon-close" />移除</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fast-upload',
  data () {
    return { uploadfiles: [], filekey: 0 }
  },
  methods: {
    add () {
      this.$refs.selectfiledialog.click()
    },
    change () {
      var file = this.$refs.selectfiledialog.files[0]
      if (file && file !== undefined) {
        this.filekey++
        this.uploadfiles.push({ file, key: this.filekey, sha1: '', reading: true })
        this.hashfile(file, this.filekey)
      } else {
        this.$message({ message: '已取消上传', type: 'warning' })
      }
    },
    hashfile (file, key) {
      let fr = new FileReader()
      fr.onload = (function (callback, fk, blobSlice) {
        return function (ev) {
          // var sTime = new Date()

          // // 成功的代码,直接计算，如果文件超大，会报错
          // let CryptoJS = require('crypto-js')
          // let hash = require('crypto-js/sha1')
          // let rst = hash(CryptoJS.lib.WordArray.create(ev.target.result)).toString()
          // callback(fk, rst)

          // 成功的代码,分块计算
          let fbuffer = ev.target.result
          let CryptoJS = require('crypto-js')
          const blocksize = 1024 * 1024 * 20
          let start = 0
          let hash = CryptoJS.algo.SHA1.create()
          while (start < file.size) {
            let end = Math.min(fbuffer.byteLength, start + blocksize)
            hash.update(CryptoJS.lib.WordArray.create(blobSlice(fbuffer, start, end)))
            start = end
          }
          let rst = hash.finalize().toString()
          callback(fk, rst)

          // var eTime = new Date()
          // console.log('此方法用时 ', eTime - sTime, ' 毫秒')
        }
      })(this.hashcallback, key, this.blobSlice)
      fr.readAsArrayBuffer(file)
    },
    hashcallback (key, sha1) {
      console.log(key, sha1)
      for (let i in this.uploadfiles) {
        if (this.uploadfiles[i].key === key) {
          this.uploadfiles[i].sha1 = sha1
          this.uploadfiles[i].reading = false
        }
      }
    },
    blobSlice (blob, startByte, endByte) {
      if (blob.slice) {
        return blob.slice(startByte, endByte)
      }
      // 兼容firefox
      if (blob.mozSlice) {
        return blob.mozSlice(startByte, endByte)
      }
      // 兼容webkit
      if (blob.webkitSlice) {
        return blob.webkitSlice(startByte, endByte)
      }
      return null
    }
  }
}
</script>

<style>
div.fileselector:hover {
  background-color: #f5f7fa;
}
</style>
