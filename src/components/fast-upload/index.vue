<template>
  <div>
    <el-button size="small" type="primary" @click="add">选取文件</el-button>
    <input @change="change" ref="selectfiledialog" type="file" hidden/>
    <div class="fileselector" v-for="(item,index) in uploadfiles" v-bind:item="item" v-bind:key="item.key" v-bind:index="index">
      <span>{{item.file.name}} </span>
      <span v-if="item.status === 0">
        <i class="el-icon-loading" />文件准备中……</span>
      <el-button v-else-if="item.status ===1" @click="upload(item.key)" size="mini" type="primary">
        <i class="el-icon-upload" />上传</el-button>
      <el-button v-else size="mini" type="danger" @click="uploadfiles.splice(index, 1)">
        <i class="el-icon-close" />移除</el-button>
    </div>
  </div>
</template>

<script>
import fileapi from '@/api/yljs/file'
import { Message } from 'element-ui'

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
        this.uploadfiles.push({ file, key: this.filekey, sha1: '', status: 0 })
        // status: 0待hash，1待上传，2上传完毕，other未定义
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
            hash.update(
              CryptoJS.lib.WordArray.create(blobSlice(fbuffer, start, end))
            )
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
          this.uploadfiles[i].status = 1
          break
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
    },
    upload (key) {
      // let postfile = () => {
      //   return new Promise((resolve, reject) => {

      //   })
      // }

      for (let i in this.uploadfiles) {
        if (this.uploadfiles[i].key === key) {
          let uploadfile = this.uploadfiles[i]
          if (uploadfile.status !== 1) {
            this.$message({ message: '文件此时不能上传', type: 'danger' })
            return
          } else {
            let BuildError = (msg) => { return new Error('上传文件失败：' + msg) }
            let blobSlice = this.blobSlice

            // 第一步，尝试快传
            fileapi.post({
              filename: uploadfile.file.name,
              filelength: uploadfile.file.size,
              filesha1: uploadfile.sha1
            }).then(function (postrst) {
              return new Promise((resolve, reject) => {
                if (!postrst || postrst === undefined) {
                  reject(new Error('PostApi，未知错误，' + uploadfile.file.name))
                } else {
                  if (postrst.code !== 1) {
                    reject(new Error('PostApi,' + postrst.msg))
                  } else {
                    if (postrst.data.code === 1) {
                      // 已经上传成功了
                      uploadfile.fileid = postrst.data.data
                      uploadfile.status = 2
                      Message({ message: '秒传成功', type: 'success' })
                    } else if (postrst.data.code === 2) {
                      resolve({ writetoken: postrst.data.data, position: postrst.data.position })
                    }
                  }
                }
              })
            }).then(function ({ writetoken, position }) {
              // 上传准备就绪，开始传递数据
              const putSize = 1024 * 1024
              let file = uploadfile.file
              let start = position

              let putfile = (pos) => {
                let end = Math.min(file.size, pos + putSize)
                return new Promise((resolve, reject) => {
                  fileapi.put({
                    writetoken,
                    position: pos,
                    data: blobSlice(file, pos, end),
                    // data: file,
                    size: end - pos
                  }).then(function (putrst) {
                    // debugger
                    if (!putrst || putrst === undefined) {
                      return reject(BuildError('PutApi,未知错误'))
                    } else {
                      if (putrst.code !== 1) {
                        return reject(BuildError('PutApi，' + putrst.msg))
                      } else {
                        if (putrst.data.code !== 3) {
                          return reject(BuildError('PutApi，' + putrst.data.msg))
                        }
                        if (putrst.data.position === end && putrst.data.data === writetoken) {
                          if (putrst.data.position === file.size) {
                            resolve({ writetoken, pos: putrst.data.position })
                          } else {
                            return putfile(putrst.data.position)
                          }
                          // 继续上传
                        } else {
                          // 服务器写入位置与预期不一致，抛弃
                          return reject(BuildError('文件上传失败：PutApi返回的结果与预期不一致,' + file.name))
                        }
                      }
                    }
                  })
                })
              }

              return putfile(start)
            }).then(function ({ writetoken, pos }) {
              // debugger
              return new Promise((resolve, reject) => {
                if (pos !== uploadfile.file.size) {
                  return reject(BuildError('要求完成上传，但结束点' + pos + '与预期' + uploadfile.file.size + '不一致。' + uploadfile.file.name))
                } else {
                  fileapi.complite(writetoken).then(function (crst) {
                    if (!crst || crst === undefined) {
                      return reject(BuildError('CompliteApi,未知错误'))
                    } else {
                      if (crst.code === 1) {
                        uploadfile.fileid = crst.data.id
                        uploadfile.status = 2
                        console.log(uploadfile.fileid)
                        Message({ message: '文件上传成功', type: 'success' })
                        resolve()
                      } else {
                        return reject(BuildError('文件上传失败：调用CompliteApi时服务器返回错误，' + crst.msg))
                      }
                    }
                  })
                }
              })
            })
          }
          break // 退出for key
        }
      }
    }
  }
}
</script>

<style>
div.fileselector:hover {
  background-color: #f5f7fa;
}
</style>
