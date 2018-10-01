import parent from '../index'
const BaseURL = parent.BaseURL + '/ryjs'

function reject (msg) {
  return Promise.reject(new Error('RYJSApi：' + msg))
}

export default {
  BaseURL,
  getbyry (ryid, pageIndex = 1) {
    if (ryid === null || ryid === undefined || ryid === '') {
      return reject('ryid不能为空！')
    }
    let url = this.BaseURL + '/getbyry/' + ryid
    if (pageIndex !== null && pageIndex !== undefined) {
      if (pageIndex < 1) {
        return reject('pageIndex不能小于1')
      }
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  },
  getbyryandjs (ryid, jsname, pageIndex = 1) {
    if (ryid === null || ryid === undefined || ryid === '') {
      return reject('ryid不能为空！')
    }
    if (jsname === null || jsname === undefined || jsname === '') {
      return reject('jsname不能为空！')
    }
    let url = this.BaseURL + '/getbyryandjs/' + ryid + '/' + jsname
    if (pageIndex !== null && pageIndex !== undefined) {
      if (pageIndex < 1) {
        return reject('pageIndex不能小于1')
      }
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  },
  createryjs (jsids, fileids) {
    if (jsids === null || jsids === undefined || jsids.length === 0) {
      return reject('技术不能为空')
    }
    if (fileids === null || fileids === undefined || fileids.length === 0) {
      return reject('支撑材料不能为空')
    }
    let url = this.BaseURL + '/postlist'
    return parent.axios.post(url, { jsidlist: jsids, fileidlist: fileids, ryid: parent.getUserId() })
  },
  getneedkjsh (ksid) {
    if (ksid === null || ksid === undefined || ksid === '') {
      return reject('ksid不能为空！')
    }
    return parent.axios.get(BaseURL + '/getneedkjsh/' + ksid)
  },
  approveKjsh (idlist, reason) {
    if (!idlist || !Array.isArray(idlist)) {
      return reject('idlist必须是数组！')
    }
    return parent.axios.put(BaseURL + '/approvekjsh', { idlist, reason })
  },
  rejectKjsh (idlist, reason) {
    if (!idlist || !Array.isArray(idlist)) {
      return reject('idlist必须是数组！')
    }
    return parent.axios.put(BaseURL + '/rejectkjsh', { idlist, reason })
  },
  approveYjsh (idlist, reason) {
    if (!idlist || !Array.isArray(idlist)) {
      return reject('idlist必须是数组！')
    }
    return parent.axios.put(BaseURL + '/approveyjsh', { idlist, reason })
  },
  rejectYjsh (idlist, reason) {
    if (!idlist || !Array.isArray(idlist)) {
      return reject('idlist必须是数组！')
    }
    return parent.axios.put(BaseURL + '/rejectyjsh', { idlist, reason })
  },
  commit (ryjsid) {
    if (!ryjsid) {
      return reject('ryjsid不能为空')
    }
    return parent.axios.patch(BaseURL + '/commit/' + ryjsid)
  }
}
