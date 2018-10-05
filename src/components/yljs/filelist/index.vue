<template>
  <div>
    <div v-for="file in filelist" :key="file.id">
      <a :href="geturl(file.id)">{{file.fileInfo.fileName}}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filelist: Array,
    filearea: String
  },
  methods: {
    geturl (key) {
      return '/api/' + this.filearea + '/' + key
    }
  }
}
</script>
