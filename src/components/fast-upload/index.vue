<template>
  <div>
    <el-button size="small" type="primary" @click="add">选取文件</el-button>
    <input @change="change" ref="selectfiledialog" type="file" hidden/>
    <div class="fileselector" v-for="(item,index) in uploadfiles" v-bind:item="item" v-bind:key="item.key" v-bind:index="index">
      <span>{{item.file.name}} </span>
      <span v-if="item.status === 0">
        <i class="el-icon-loading" />文件准备中……</span>
      <el-button v-else-if="item.status ===1" size="mini" type="primary">
        <i class="el-icon-upload" />上传</el-button>
      <el-button v-else size="mini" type="danger" @click="uploadfiles.splice(index, 1)">
        <i class="el-icon-close" />移除</el-button>
    </div>
  </div>
</template>

<script>
import fileapi from "@/api/yljs/file";

export default {
  name: "fast-upload",
  data() {
    return { uploadfiles: [], filekey: 0 };
  },
  methods: {
    add() {
      this.$refs.selectfiledialog.click();
    },
    change() {
      var file = this.$refs.selectfiledialog.files[0];
      if (file && file !== undefined) {
        this.filekey++;
        this.uploadfiles.push({ file, key: this.filekey, sha1: "", status: 0 });
        // status: 0待hash，1待上传，2上传完毕，other未定义
        this.hashfile(file, this.filekey);
      } else {
        this.$message({ message: "已取消上传", type: "warning" });
      }
    },
    hashfile(file, key) {
      let fr = new FileReader();
      fr.onload = (function(callback, fk, blobSlice) {
        return function(ev) {
          // var sTime = new Date()

          // // 成功的代码,直接计算，如果文件超大，会报错
          // let CryptoJS = require('crypto-js')
          // let hash = require('crypto-js/sha1')
          // let rst = hash(CryptoJS.lib.WordArray.create(ev.target.result)).toString()
          // callback(fk, rst)

          // 成功的代码,分块计算
          let fbuffer = ev.target.result;
          let CryptoJS = require("crypto-js");
          const blocksize = 1024 * 1024 * 20;
          let start = 0;
          let hash = CryptoJS.algo.SHA1.create();
          while (start < file.size) {
            let end = Math.min(fbuffer.byteLength, start + blocksize);
            hash.update(
              CryptoJS.lib.WordArray.create(blobSlice(fbuffer, start, end))
            );
            start = end;
          }
          let rst = hash.finalize().toString();
          callback(fk, rst);

          // var eTime = new Date()
          // console.log('此方法用时 ', eTime - sTime, ' 毫秒')
        };
      })(this.hashcallback, key, this.blobSlice);
      fr.readAsArrayBuffer(file);
    },
    hashcallback(key, sha1) {
      console.log(key, sha1);
      for (let i in this.uploadfiles) {
        if (this.uploadfiles[i].key === key) {
          this.uploadfiles[i].sha1 = sha1;
          this.uploadfiles[i].status = 1;
          break;
        }
      }
    },
    blobSlice(blob, startByte, endByte) {
      if (blob.slice) {
        return blob.slice(startByte, endByte);
      }
      // 兼容firefox
      if (blob.mozSlice) {
        return blob.mozSlice(startByte, endByte);
      }
      // 兼容webkit
      if (blob.webkitSlice) {
        return blob.webkitSlice(startByte, endByte);
      }
      return null;
    },
    upload(key) {
      for (let i in this.uploadfiles) {
        if (this.uploadfiles[i].key === key) {
          let uploadfile = this.uploadfiles[i];
          if (uploadfile.status !== 1) {
            this.$message({ message: "文件此时不能上传", type: "danger" });
          } else {
            // 第一步，尝试快传
            let postrst = fileapi.post({
              filename: uploadfile.name,
              filelength: uploadfile.size,
              filesha1: uploadfile.sha1
            });
            if (postrst && postrst !== undefined) {
              if (postrst.code === 1) {
                if (postrst.data.code === 1) {
                  this.$message({ message: "秒传成功", type: "success" });
                  uploadfile.fileid = postrst.data.data;
                  uploadfile.status = 2;
                  return;
                } else if (postrst.data.code === 2) {
                  // 上传准备就绪，开始传递数据
                  const putSize = 1024 * 1024;
                  let writetoken = postrst.data.data;
                  let start = postrst.data.position;
                  let file = uploadfile.file;
                  while (start < file.byteLength) {
                    let end = Math.min(file.byteLength, start + putSize);
                    let putrst = fileapi.put({
                      writetoken,
                      position: start,
                      data: this.blobSlice(file, start, end),
                      size: end - start
                    });
                    if (putrst && putrst !== undefined) {
                      if (putrst.code === 1) {
                        if (putrst.position === end && putrst.data === writetoken) {
                          start = end; //继续上传
                        } else {
                          //服务器写入位置与预期不一致，抛弃
                          this.$logError(
                            "文件上传失败：PutApi返回的结果与预期不一致," + file.name
                          );
                          return;
                        }
                      } else {
                        this.$logError(
                          "文件上传失败：服务器返回错误，" + putrst.msg
                        );
                        return;
                      }
                    } else {
                      this.$logError(
                        "文件上传失败：调用PutApi时发生错误，" + file.name
                      );
                      return;
                    }
                  }

                  // 完成上传的持久化
                  if(end !== file.byteLength){
                    this.$logError(
                        "文件上传失败：要求完成上传，但结束点" + end +"与预期" + file.byteLength +"不一致。"+ file.name
                      );
                      return;
                  }else{
                    // call api
                    var crst = fileapi.comlite(writetoken)
                    if(crst && crst !== undefined){
                      if(crst.code ===1){
                        uploadfile.fileid=crst.data
                        uploadfile.status=2
                      }else{
                        this.$logError("文件上传失败：调用CompliteApi时发生错误，" + file.name);
                      }
                    }
                  }
                } else {
                  this.$logError("文件上传失败：PostApi返回的结果未定义," +postrst.msg);
                }
              } else {
                this.$logError("文件上传失败：服务器返回错误，" + postrst.msg);
              }
            } else {
              this.$logError(
                "文件上传失败：调用PostApi时发生错误，" + uploadfile.name
              );
            }
            break; //退出for key
          }
        }
      }
    }
  }
};
</script>

<style>
div.fileselector:hover {
  background-color: #f5f7fa;
}
</style>
