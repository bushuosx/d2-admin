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
        return '正高级'
      default:
        return '未知'
    }
  },
  formartZC (zc) {
    return this.formartZcLevel(zc)
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
  },
  formartXL (xl) {
    switch (xl) {
      case 1:
        return '小学学历'
      case 2:
        return '初中学历'
      case 3:
        return '高中学历'
      case 4:
        return '大专学历'
      case 5:
        return '本科学历'
      case 6:
        return '硕士学历'
      case 7:
        return '博士学历'
      default:
        return '未知'
    }
  },
  formartXW (xw) {
    switch (xw) {
      case 5:
        return '学士学位'
      case 6:
        return '硕士学位'
      case 7:
        return '博士学位'
      default:
        return '未知'
    }
  },
  formartSH (shStatus) {
    switch (shStatus) {
      case 0:
        return '待提交'
      case 1:
        return '待审核'
      case 2:
        return '已审核'
      case 3:
        return '已驳回'
      default:
        return '未知'
    }
  },
  formartZYLB (zylb) {
    if (zylb && zylb.bm && zylb.mc) {
      return `${zylb.bm} - ${zylb.mc}`
    } else {
      return undefined
    }
  }
}
