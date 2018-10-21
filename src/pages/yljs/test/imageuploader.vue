<template>
  <d2-container>
    <image-uploader @Upload-Success="handleUploadSuccess"></image-uploader>

    <div>{{fileid}}</div>
    <div><img :src="filedata"></div>
  </d2-container>
</template>

<script>
export default {
  components: {
    'image-uploader': () => import('@/components/image-uploader')
  },
  data () {
    return {
      fileid: null,
      filedata: null
    }
  },
  methods: {
    handleUploadSuccess (fileid, filedata) {
      this.fileid = fileid
      this.filedata = filedata
    }
  }
}
</script>
