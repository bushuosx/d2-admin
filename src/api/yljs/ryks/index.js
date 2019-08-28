import parent from '../index'
const BaseURL = parent.BaseURL + '/ryks'

function reject (msg) {
  return Promise.reject(new Error('RYKSApi：' + msg))
}

export default {
  BaseURL,
  createryks (ksid, reason) {
    if (ksid === null || ksid === undefined || ksid === '') {
      return reject('ksid不能为空')
    }
    return parent.axios.post(BaseURL, { ryid: parent.getUserId(), ksid, reason })
  },
  getbyry (ryid) {
    if (ryid === null || ryid === undefined || ryid === '') {
      return reject('ryid不能为空')
    }
    return parent.axios.get(BaseURL + '/getbyry/' + ryid)
  },
  getbyks (ksid) {
    if (ksid === null || ksid === undefined || ksid === '') {
      return reject('ryid不能为空')
    }
    return parent.axios.get(BaseURL + '/getbyks/' + ksid)
  },
  getmine () {
    return this.getbyry(parent.getUserId())
  },
  get (ryksid) {
    if (ryksid === null || ryksid === undefined || ryksid === '') {
      return reject('ryksid不能为空')
    }
    return parent.axios.get(BaseURL + '/' + ryksid)
  },
  editryks (ryksid, ksid, reason) {
    if (ryksid === null || ryksid === undefined || ryksid === '') {
      return reject('ryksid不能为空')
    }
    if (ksid === null || ksid === undefined || ksid === '') {
      return reject('ksid不能为空')
    }
    return parent.axios.put(BaseURL + '/editryks/', { ryksid, ksid, reason })
  },
  getneedkjsh (ksid) {
    if (ksid === null || ksid === undefined || ksid === '') {
      return reject('ksid不能为空')
    }
    return parent.axios.get(BaseURL + '/getneedkjsh/' + ksid)
  },
  approvekjsh (ksid, ryksidlist) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    if (ryksidlist === null || ryksidlist === undefined || !ryksidlist.length) {
      return reject('ryksidlist不能为空')
    }
    return parent.axios.patch(BaseURL + '/approvekjsh/' + ksid, ryksidlist)
  },
  rejectkjsh (ksid, ryksidlist) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    if (ryksidlist === null || ryksidlist === undefined || !ryksidlist.length) {
      return reject('ryksidlist不能为空')
    }
    return parent.axios.patch(BaseURL + '/rejectkjsh/' + ksid, ryksidlist)
  },
  reedit (ryksid) {
    if (ryksid === null || ryksid === undefined || ryksid === '') {
      return reject('ryksid不能为空')
    }
    return parent.axios.patch(BaseURL + '/reedit/' + ryksid)
  },
  commit (ryksid) {
    if (ryksid === null || ryksid === undefined || ryksid === '') {
      return reject('ryksid不能为空')
    }
    return parent.axios.patch(BaseURL + '/commit/' + ryksid)
  },
  getprofileneedkjsh (ksid) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    return parent.axios.get(BaseURL + '/getprofileneedkjsh/' + ksid)
  },
  getrybyks (ksid) {
    if (!ksid) {
      return reject('ksid不能为空')
    }
    return parent.axios.get(BaseURL + '/getrybyks/' + ksid)
  },
  // ban (IDList, Reason) {
  //   if (!Reason) {
  //     return reject('reason不能为空')
  //   }
  //   if (!Array.isArray(IDList)) {
  //     return reject('IDList不能为空')
  //   }
  //   return parent.axios.put(BaseURL + '/ban', { IDList, Reason })
  // },
  ban (ryid, ksid, reason) {
    if (!ryid) {
      return reject('ryid不能为空')
    }
    if (!ksid) {
      return reject('ksid不能为空')
    }
    if (!reason) {
      return reject('reason不能为空')
    }
    return parent.axios.put(BaseURL + '/ban', { ryid, ksid, reason })
  },
  banallksofry (ryid, reason) {
    if (!ryid) {
      return reject('ryid不能为空')
    }

    return parent.axios.put(BaseURL + '/banallksofry', { ryid, reason })
  },
  banmyryks (ryksid) {
    if (!ryksid) {
      return reject('ryksid不能为空')
    }

    return parent.axios.put(BaseURL + '/banmyryks/' + ryksid)
  },
  getneedkjshcount (ksid) {
    if (!ksid) {
      return reject('ksid不能为空')
    }

    return parent.axios.get(BaseURL + '/getneedkjshcount/' + ksid)
  },
  updatezw ({ ryid, ksid, zw }) {
    if (!ryid) {
      return reject('ryid不能为空')
    }
    if (!ksid) {
      return reject('ksid不能为空')
    }
    if (!zw) {
      return reject('zw不能为空')
    }

    return parent.axios.put(BaseURL + '/updatezw', { ryid, ksid, zw })
  }
}
