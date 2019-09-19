<template>
  <div v-loading="loading">
    <div>
      <div class="imageDiv">
        <div class="imageDiv-header">将要上传的图片</div>
        <div class="cropData">
          <img :style="halfInchPhotoDiv"
               alt="剪裁的图片"
               :src="cropData">
        </div>
      </div>
      <div class="imageDiv">
        <div class="imageDiv-header">原始图片</div>
        <div class="cropper">
          <VueCropper ref="cropper"
                      :img="option.img"
                      :outputSize="option.outputSize"
                      :outputType="option.outputType"
                      :info="option.info"
                      :infoTrue="option.infoTrue"
                      :full="option.full"
                      :canMove="option.canMove"
                      :canMoveBox="option.canMoveBox"
                      :original="option.original"
                      :autoCrop="option.autoCrop"
                      :autoCropWidth="option.autoCropWidth"
                      :autoCropHeight="option.autoCropHeight"
                      :fixedBox="option.fixedBox"
                      :fixedNumber="option.fixedNumber"
                      :fixed="option.fixed"
                      :centerBox="option.centerBox"
                      :canScale="option.canScale"
                      @realTime="realTime"></VueCropper>
        </div>
      </div>

    </div>
    <div class="uploadFileSelector">
      <input type="file"
             @change="handleFileChange"
             accept=".jpg,.jpeg" />
      <el-button :disabled="!file"
                 @click="handleClick"
                 type="primary"
                 size="small">上传</el-button>
    </div>

  </div>
</template>

<script>
import fileapi from '@/api/yljs/file'
import { VueCropper } from 'vue-cropper'
export default {
  data () {
    const oneInchPhoto = { height: 413, width: 295 }
    return {
      oneInchPhotoDiv: {
        height: oneInchPhoto.height + 'px',
        width: oneInchPhoto.width + 'px'
      },
      halfInchPhotoDiv: {
        height: oneInchPhoto.height / 2 + 'px',
        width: oneInchPhoto.width / 2 + 'px'
      },
      file: null,
      option: {
        img: '',
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: 'jpeg',
        info: true,
        infoTrue: true,
        canMove: true,
        canMoveBox: true,
        original: false,
        autoCrop: true,
        autoCropWidth: oneInchPhoto.width / 10,
        autoCropHeight: oneInchPhoto.height / 10,
        fixedNumber: [oneInchPhoto.width, oneInchPhoto.height],
        fixed: true,
        fixedBox: false,
        centerBox: true,
        canScale: true
      },
      cropData: {},
      loading: false
    }
  },
  components: {
    VueCropper
  },
  methods: {
    handleFileChange (e) {
      this.file = e.target.files[0]
      let fr = new FileReader()
      fr.onload = (ev) => {
        this.option.img = ev.target.result
      }
      fr.readAsDataURL(this.file)
    },
    handleClick () {
      this.loading = true
      this.$refs.cropper.getCropBlob((data) => {
        // do something
        fileapi.uploadBlob(data, this.file.name).then(res => {
          this.loading = false
          this.emitUploadSuccess(res)
        }).catch(err => {
          this.loading = false
          this.$message.error(err.message ? err.message : err)
        })
      })
    },
    realTime (data) {
      this.$refs.cropper.getCropData((cd) => {
        this.cropData = cd
      })
    },
    getImageData () {
      // 获取截图的blob数据
      this.$refs.cropper.getCropBlob((data) => {
        // do something
        console.log(data)
      })
    },
    emitUploadSuccess (fileid) {
      this.$emit('Upload-Success', fileid, this.cropData)
    }
  }
}
</script>

<style>
div.imageDiv {
  display: inline-block;
  vertical-align: top;
  margin-right: 10px;
}
div.imageDiv-header {
  font-size: 1.5em;
}
div.cropper {
  width: 640px;
  height: 480px;
}
div.uploadFileSelector {
  margin-top: 1em;
}
</style>
