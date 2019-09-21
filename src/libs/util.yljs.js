const ZCObject = {
  '初级': 1,
  '中级': 2,
  '副高级': 3,
  '正高级': 4
}
const XLObject = {
  '小学学历': 1,
  '初中学历': 2,
  '高中学历': 3,
  '大专学历': 4,
  '本科学历': 5,
  '硕士学历': 6,
  '博士学历': 7
}
const XWObject = {
  '学士学位': 5,
  '硕士学位': 6,
  '博士学位': 7
}
const SHStateObject = {
  '待提交': 0,
  '待审核': 1,
  '已审核': 2,
  '已驳回': 3
}
const GWObject = {
  '医师': 1,
  '护士': 2,
  '技师': 3,
  '行政人员': 4,
  '后勤人员': 5,

  '医学实习生': 10,
  '进修医师': 11,
  '规培医师': 12,

  '护理实习生': 20,
  '进修护士': 21
}
const KSObject = {
  '临床科室': 1,
  '医技科室': 2,
  '门诊部门': 4,
  '护理部门': 8,
  '临床附属科室': 16,
  '行政科室': 32,
  '后勤部门': 64
}
const XBObject = {
  '男': 1,
  '女': 2
}

const undefinedTag = ' -undefined- '

const GetKey = function (value, keyValueObject, noShowUndefinedTag) {
  for (let k in keyValueObject) {
    if (keyValueObject[k] === value) {
      return k
    }
  }
  if (noShowUndefinedTag !== true) return undefinedTag
}

const GetKeyValueArray = function (keyValueObject, noUndefinedTag) {
  let rst = []
  for (let k in keyValueObject) {
    rst.push({ key: k, value: keyValueObject[k] })
  }
  if (noUndefinedTag !== true) {
    if (rst.findIndex(x => x.value === 0) === -1) {
      rst.push({ key: undefinedTag, value: 0 })
    }
  }
  return rst
}

export default {
  isString (obj) { // 判断对象是否是字符串
    return !!obj && Object.prototype.toString.call(obj) === '[object String]'
  },
  GWObject,
  XBObject,
  ZCObject,
  XLObject,
  XWObject,
  KSObject,
  SHStateObject,
  GetKeyValueArray,
  GetKey,
  formartZcLevel (zclevel) {
    return GetKey(zclevel, ZCObject)
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
    return GetKey(xl, XLObject)
  },
  formartXW (xw) {
    return GetKey(xw, XWObject)
  },
  formartSH (shState) {
    return GetKey(shState, SHStateObject)
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
    return GetKey(gw, GWObject)
  },
  formartXB (xb) {
    return GetKey(xb, XBObject)
  },
  formartKSType (t) {
    return GetKey(t, KSObject)
  }
}
