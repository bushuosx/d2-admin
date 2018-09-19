<template>
  <el-card style="margin:4px 0px">
    <div slot="header" class="clearfix">
      <slot name="title" />
      <div>
        <el-button size="small" type="primary" @click="add">点击选择要上传的文件</el-button>
      </div>
    </div>
    <input @change="change" ref="selectfiledialog" type="file" hidden/>
    <div style="margin:2px" class="fileselector" v-for="(item,index) in uploadfiles" v-bind:item="item" v-bind:key="item.key" v-bind:index="index">
      <div style="min-width:200px;display:inline-block">{{item.file.name}} </div>
      <span v-if="item.status === 0">
        <i class="el-icon-loading" />
        <span>文件准备中……</span>
      </span>
      <span v-else-if="item.status ===1 || item.status===4" style="margin:auto auto auto 4px">
        <el-button @click="upload(item.key)" size="mini" type="primary">
          <i class="el-icon-upload" />上传</el-button>
      </span>
      <div v-else-if="item.status === 2" style="width:20%;display:inline-block">
        <i class="el-icon-loading" />
        <el-progress :text-inside="true" :stroke-width="18" :percentage="item.pos === undefined ? 0 : Math.round((item.pos / item.file.size)*100)"></el-progress>
      </div>
      <span v-else-if="item.status === 3">
        <el-tooltip content="已上传" placement="top">
          <i class="el-icon-check" style="color:#67C23A;width:20px" />
        </el-tooltip>
      </span>
      <el-button style="margin:auto auto auto 4px" size="mini" type="danger" @click="uploadfiles.splice(index, 1)" circle>
        <i class="el-icon-close " />
      </el-button>
    </div>
  </el-card>
</template>

<script>
import fileapi from '@/api/yljs/file'
import { Message } from 'element-ui'

export default {
  name: 'fast-upload',
  data () {
    // uploadfile.status:0待hash，1待上传，2正在上传,3上传成功，4上传失败,other未定义
    return { uploadfiles: [], filekey: 0 }
  },
  computed: {
    fileidlist: function () {
      let fileids = []
      for (let i in this.uploadfiles) {
        if (this.uploadfiles[i].status === 3) {
          fileids.push(this.uploadfiles[i].fileid)
        }
      }
      return fileids
    }
  },
  methods: {
    add () {
      this.$refs.selectfiledialog.click()
    },
    change () {
      var file = this.$refs.selectfiledialog.files[0]
      if (file && file !== undefined) {
        this.filekey++
        this.uploadfiles.push({ file, key: this.filekey, sha1: '', status: 0, pos: 0, fileid: null })
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
      // let LogError = this.$logError
      for (let i in this.uploadfiles) {
        if (this.uploadfiles[i].key === key) {
          let uploadfile = this.uploadfiles[i]
          if (uploadfile.status !== 1 && uploadfile.status !== 4) {
            this.$message({ message: '文件此时不能上传', type: 'error' })
            return
          } else {
            let BuildError = (msg) => { return new Error('上传文件失败：' + msg) }
            let blobSlice = this.blobSlice
            // 第一步，尝试快传
            uploadfile.status = 2
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
                      // 秒传了。。。
                      resolve({ fileid: postrst.data.data })
                    } else if (postrst.data.code === 2) {
                      resolve({ writetoken: postrst.data.data, position: postrst.data.position })
                    }
                  }
                }
              })
            }).then(function ({ fileid, writetoken, position }) {
              if (fileid !== undefined && fileid) {
                return Promise.resolve({ fileid })
              }

              // 上传准备就绪，开始传递数据
              const putSize = 1024 * 1024
              let file = uploadfile.file
              let start = position
              // 需要递归使用，所以声明
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
                    if (!putrst || putrst === undefined) {
                      return reject(BuildError('PutApi,未知错误'))
                    } else {
                      if (putrst.code !== 1) {
                        return reject(BuildError('PutApi，' + putrst.msg))
                      } else {
                        if (putrst.data.code !== 3) {
                          return reject(BuildError('PutApi，' + putrst.data.msg))
                        } else {
                          // debugger
                          if (putrst.data.position !== end || putrst.data.data !== writetoken) {
                            // 服务器写入位置与预期不一致，抛弃
                            return reject(BuildError('PutApi返回的结果与预期不一致,' + file.name))
                          } else {
                            uploadfile.pos = putrst.data.position
                            if (putrst.data.position === file.size) {
                              return resolve({ writetoken, pos: putrst.data.position })
                            } else {
                              // 继续上传
                              return putfile(putrst.data.position)
                                .then(res => { resolve(res) })
                                .catch(err => { return reject(err) })
                            }
                          }
                        }
                      }
                    }
                  })
                })
              }

              return putfile(start)
            }).then(function ({ fileid, writetoken, pos }) {
              // if (fileid !== undefined && fileid) {
              //   return Promise.resolve({ fileid })
              // }
              return new Promise((resolve, reject) => {
                // debugger
                if (fileid !== undefined && fileid) {
                  return resolve({ fileid })
                }
                if (!writetoken || writetoken === undefined) {
                  return reject(BuildError('要求完成上传，但writetoken未知'))
                }
                if (pos !== uploadfile.file.size) {
                  return reject(BuildError('要求完成上传，但结束点' + pos + '与预期' + uploadfile.file.size + '不一致。' + uploadfile.file.name))
                } else {
                  fileapi.complite(writetoken).then(function (crst) {
                    if (!crst || crst === undefined) {
                      return reject(BuildError('CompliteApi,未知错误'))
                    } else {
                      if (crst.code === 1) {
                        // 文件上传成功
                        return resolve({ fileid: crst.data.id })
                      } else {
                        return reject(BuildError('文件上传失败：调用CompliteApi时服务器返回错误，' + crst.msg))
                      }
                    }
                  }).catch(err => { return reject(err) })
                }
              })
            }).then(function ({ fileid }) {
              return new Promise((resolve, reject) => {
                if (fileid !== undefined && fileid) {
                  uploadfile.fileid = fileid
                  uploadfile.status = 3 // 上传已成功
                  Message({ message: '文件上传成功：' + uploadfile.file.name, type: 'success' })
                } else {
                  return reject(BuildError('未预知的错误'))
                }
              })
            }).catch(
              err => {
                uploadfile.status = 4// 上传失败
                Message({ message: err.message ? err.message : err, type: 'error' })
              }
            )
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
