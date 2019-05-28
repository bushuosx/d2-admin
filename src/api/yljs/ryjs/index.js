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
  getbyks (ksid, pageIndex = 1) {
    if (!ksid) {
      return reject('ryid不能为空！')
    }
    let url = this.BaseURL + '/getbyks/' + ksid
    if (pageIndex) {
      if (pageIndex < 1) {
        return reject('pageIndex不能小于1')
      }
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  },
  getmine (pageIndex = 1) {
    let url = this.BaseURL + '/getmine'
    if (pageIndex) {
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
    // if (fileids === null || fileids === undefined || fileids.length === 0) {
    //   return reject('支撑材料不能为空')
    // }
    // let url = this.BaseURL + '/postlist'

    if (!Array.isArray(fileids)) {
      fileids = []
    }
    let url = this.BaseURL + '/postlistsimple'
    return parent.axios.post(url, { jsidlist: jsids, fileidlist: fileids })
  },
  getneedkjsh (ksid, pageIndex = 1) {
    if (!ksid) {
      return reject('ksid不能为空！')
    }
    let url = BaseURL + '/getneedkjsh/' + ksid
    if (pageIndex) {
      if (pageIndex < 1) {
        return reject('pageIndex不能小于1')
      }
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  },
  approveKjsh (ksid, idlist, reason) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    if (!idlist || !Array.isArray(idlist)) {
      return reject('idlist必须是数组！')
    }
    return parent.axios.put(BaseURL + '/approvekjsh/' + ksid, { idlist, reason })
  },
  rejectKjsh (ksid, idlist, reason) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    if (!idlist || !Array.isArray(idlist)) {
      return reject('idlist必须是数组！')
    }
    return parent.axios.put(BaseURL + '/rejectkjsh/' + ksid, { idlist, reason })
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
  commit (ryjsidlist) {
    if (!Array.isArray(ryjsidlist) || ryjsidlist.length === 0) {
      return reject('ryjsid不能为空')
    }
    return parent.axios.patch(BaseURL + '/commit', ryjsidlist)
  },
  reedit (ryjsidlist) {
    if (!Array.isArray(ryjsidlist) || ryjsidlist.length === 0) {
      return reject('ryjsid不能为空')
    }
    return parent.axios.patch(BaseURL + '/reedit', ryjsidlist)
  },
  update (ryjsidlist, fileIdList) {
    if (!Array.isArray(ryjsidlist) || ryjsidlist.length === 0) {
      return reject('ryjsid不能为空')
    }

    // if (!Array.isArray(fileIdList) || fileIdList.length === 0) {
    //   return reject('支撑文件不能为空')
    // }

    if (!Array.isArray(fileIdList)) {
      fileIdList = []
    }

    return parent.axios.put(BaseURL, { ryjsidlist, fileIdList })
  },
  delete (ryjsidlist) {
    if (!Array.isArray(ryjsidlist) || ryjsidlist.length === 0) {
      return reject('ryjsid不能为空')
    }
    return parent.axios.put(BaseURL + '/delete', ryjsidlist)
  },
  getneedyjsh (ksid, pageIndex = 1) {
    let url
    if (ksid) {
      url = BaseURL + '/getneedyjsh/' + ksid
    } else {
      url = BaseURL + '/getallneedyjsh'
    }
    if (pageIndex) {
      if (pageIndex < 1) {
        return reject('pageIndex不能小于1')
      }
      url += '/' + pageIndex
    }
    return parent.axios.get(url)
  },
  getrybyksandjs (ksid, jsid) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    if (!jsid) {
      return reject('jsid不能为空')
    }
    return parent.axios.get(BaseURL + '/getrybyksandjs/' + ksid + '/' + jsid)
  },
  searchjsreport ({ mc, bm, dj, limited, ksid, pageIndex, pageSize }) {
    return parent.axios.post(BaseURL + '/searchjsreport', { mc, bm, dj, limited, ksid, pageIndex, pageSize })
  },
  getrylistbyjs (jsid) {
    if (!jsid) {
      return reject('jsid不能为空')
    }
    return parent.axios.get(BaseURL + '/getrylistbyjs/' + jsid)
  },
  search (option) {
    if (!option) {
      return reject('option不能为空')
    }

    return parent.axios.post(BaseURL + '/search', option)
  }
}
