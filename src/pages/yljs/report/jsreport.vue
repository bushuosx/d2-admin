<template>
  <d2-container loading="loading">
    <strong slot="header">全院技术统计报表</strong>
    <table class="responstable">
      <thead>
        <tr>
          <th></th>
          <th>全院</th>
          <th>已授权</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>技术总数</td>
          <td>{{alljs.total}}</td>
          <td>
            <el-button @click="toSearch({})"
                       type="primary"
                       size="small"
                       plain> {{approvedjs.total}} </el-button>
          </td>
        </tr>
        <tr>
          <td>一级</td>
          <td>{{alljs.level1}}</td>
          <td>
            <el-button @click="toSearch({dj:1})"
                       type="primary"
                       size="small"
                       plain> {{approvedjs.level1}} </el-button>
          </td>
        </tr>
        <tr>
          <td>二级</td>
          <td>{{alljs.level2}}</td>
          <td>
            <el-button @click="toSearch({dj:2})"
                       type="primary"
                       size="small"
                       plain> {{approvedjs.level2}} </el-button>
          </td>
        </tr>
        <tr>
          <td>三级</td>
          <td>{{alljs.level3}}</td>
          <td>
            <el-button @click="toSearch({dj:3})"
                       type="primary"
                       size="small"
                       plain> {{approvedjs.level3}} </el-button>
          </td>
        </tr>
        <tr>
          <td>四级</td>
          <td>{{alljs.level4}}</td>
          <td>
            <el-button @click="toSearch({dj:4})"
                       type="primary"
                       size="small"
                       plain> {{approvedjs.level4}} </el-button>
          </td>
        </tr>
        <tr>
          <td>限制类</td>
          <td>{{alljs.limited}}</td>
          <td>
            <el-button @click="toSearch({limited:true})"
                       type="primary"
                       size="small"
                       plain> {{approvedjs.limited}} </el-button>
          </td>
        </tr>
        <tr>
          <td>院内自定义</td>
          <td>{{alljs.diy}}</td>
          <td>
            <el-button @click="toSearch({bm:'Y.'})"
                       type="primary"
                       size="small"
                       plain> {{approvedjs.diy}} </el-button>
          </td>
        </tr>
      </tbody>
    </table>
  </d2-container>
</template>

<script>
import jsapi from '@/api/yljs/js'
export default {
  name: 'yljs-report-jsreport',
  data () {
    return {
      loading: false,
      alljs: {},
      approvedjs: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.alljs = {}
      this.approvedjs = {}

      jsapi.getalljsreport().then(res => {
        this.loading = false
        if (res.code === 1) {
          this.alljs = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })

      jsapi.getapprovedjsreport().then(res => {
        this.loading = false
        if (res.code === 1) {
          this.approvedjs = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    toSearch (soption) {
      // debugger
      if (soption) {
        this.$router.push({ name: 'yljs-js-search', params: { soption } })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/*

RESPONSTABLE 2.0 by jordyvanraaij
  Designed mobile first!

If you like this solution, you might also want to check out the 1.0 version:
  https://gist.github.com/jordyvanraaij/9069194

*/

// Default options for table style
$table-breakpoint: 480px;
$table-background-color: #fff;
$table-text-color: #024457;
$table-outer-border: 1px solid #167f92;
$table-cell-border: 1px solid #d9e4e6;

// Extra options for table style (parse these arguments when including your mixin)
$table-border-radius: 10px;
$table-highlight-color: #eaf3f3;
$table-header-background-color: #167f92;
$table-header-text-color: #fff;
$table-header-border: 1px solid #fff;

// The Responstable mixin

@mixin responstable(
  $breakpoint: $table-breakpoint,
  $background-color: $table-background-color,
  $text-color: $table-text-color,
  $outer-border: $table-outer-border,
  $cell-border: $table-cell-border,
  $border-radius: none,
  $highlight-color: none,
  $header-background-color: $table-background-color,
  $header-text-color: $table-text-color,
  $header-border: $table-cell-border
) {
  .responstable {
    margin: 1em 0;
    width: 100%;
    overflow: hidden;
    background: $background-color;
    color: $text-color;
    border-radius: $border-radius;
    border: $outer-border;

    tr {
      border: $cell-border;
      &:nth-child(odd) {
        // highlight the odd rows with a color
        background-color: $highlight-color;
      }
    }

    th {
      display: none; // hide all the table header for mobile
      border: $header-border;
      background-color: $header-background-color;
      color: $header-text-color;
      padding: 1em;
      &:first-child {
        // show the first table header for mobile
        display: table-cell;
        text-align: center;
      }
      &:nth-child(2) {
        // show the second table header but replace the content with the data-th from the markup for mobile
        display: table-cell;
        span {
          display: none;
        }
        &:after {
          content: attr(data-th);
        }
      }
      @media (min-width: $breakpoint) {
        &:nth-child(2) {
          // hide the data-th and show the normal header for tablet and desktop
          span {
            display: block;
          }
          &:after {
            display: none;
          }
        }
      }
    }

    td {
      display: block; // display the table data as one block for mobile
      word-wrap: break-word;
      max-width: 7em;
      &:first-child {
        display: table-cell; // display the first one as a table cell (radio button) for mobile
        text-align: center;
        border-right: $cell-border;
      }
      @media (min-width: $breakpoint) {
        border: $cell-border;
      }
    }

    th,
    td {
      text-align: left;
      margin: 0.5em 1em;
      @media (min-width: $breakpoint) {
        display: table-cell; // show the table as a normal table for tablet and desktop
        padding: 1em;
      }
    }
  }
}

// Include the mixin (with extra options as overrides)

@include responstable(
  $border-radius: $table-border-radius,
  $highlight-color: $table-highlight-color,
  $header-background-color: $table-header-background-color,
  $header-text-color: $table-header-text-color,
  $header-border: $table-header-border
);
</style>
