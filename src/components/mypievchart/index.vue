<template>
  <VePie :data="tmpdata"
         :events="chartEvents"></VePie>
</template>

<script>
import { VePie } from 'v-charts'

function sortmethod (a, b) {
  if (a.index === null || a.index === undefined || b.index === null || b.index === undefined) {
    return 0
  } else {
    return b.index - a.index
  }
}
export default {
  components: {
    VePie
  },
  props: {
    data: Array,
    filter: Function
  },
  data () {
    return {
      chartEvents: {
        click: (e) => {
          // console.log(e)
          this.emitClickPie(e.name)
        }
      }
    }
  },
  computed: {
    tmpdata () {
      let rst = []
      for (let i in this.data) {
        let found = false
        let { key, index } = this.filter(this.data[i])
        for (let j in rst) {
          if (rst[j].key === key) {
            rst[j].value++
            found = true
            break
          }
        }
        if (found !== true) {
          rst.push({ key, value: 1, index })
        }
      }
      return { columns: ['key', 'value'], rows: rst.sort(sortmethod) }
    }
  },
  methods: {
    emitClickPie (name) {
      this.$emit('click-pie', name)
    }
  }
}
</script>
