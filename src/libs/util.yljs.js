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
  },
  formartKSList (kslist) {
    if (!Array.isArray(kslist) || kslist.length === 0) {
      return '无'
    }
    return kslist.map(x => x.mc).join('，')
  },
  formartGW (gw) {
    switch (gw) {
      case 1:
        return '医师'
      case 2:
        return '护士'
      case 3:
        return '技士'
      case 4:
        return '行政人员'
      case 5:
        return '后勤人员'
      case 10:
        return '医学实习生'
      case 11:
        return '进修医师'
      case 12:
        return '规培医师'
      case 20:
        return '护理实习生'
      case 21:
        return '进修护师'
      default:
        return '未知'
    }
  },
  formartXB (xb) {
    switch (xb) {
      case 1:
        return '男'
      case 2:
        return '女'
      default:
        return '未知'
    }
  },
  formartKSType (t) {
    switch (t) {
      case 1:
        return '临床科室'
      case 2:
        return '医技科室'
      case 4:
        return '门诊部门'
      case 8:
        return '护理部门'
      case 16:
        return '临床附属科室'
      case 32:
        return '行政科室'
      case 64:
        return '后勤部门'
      default:
        return '-'
    }
  }
}
