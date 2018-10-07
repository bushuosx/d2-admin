export default {
  isString (obj) { // 判断对象是否是字符串
    return !!obj && Object.prototype.toString.call(obj) === '[object String]'
  },
  formartZcLevel (zclevel) {
    switch (zclevel) {
      case 1:
        return '初级'
      case 2:
        return '中级'
      case 3:
        return '副高级'
      case 4:
        return '高级'
      default:
        return '未知'
    }
  },
  formartDate (date) {
    if (!date) {
      return ''
    } else if (this.isString(date)) {
      date = new Date(date)
    }
    if (!(date instanceof Date)) {
      return '时间格式化错误'
    }
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  },
  formartNZ (date) {
    if (!date) {
      return ''
    } else if (this.isString(date)) {
      date = new Date(date)
      // date.setTime(Date.parse(date))
    }
    if (!(date instanceof Date)) {
      return '时间格式化错误'
    }

    let val = new Date() - date
    if (val < 0) {
      return '时间有误'
    }
    const oneyear = 1000 * 60 * 60 * 24 * 365.25
    let year = Math.floor(val / oneyear)
    let month = Math.floor((val - year * oneyear) / (oneyear / 12))
    return year > 0 ? `${year} 年 ${month} 月` : `${month} 月`
  }
}
