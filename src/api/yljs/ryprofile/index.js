import parent from '../index'
const BaseURL = parent.BaseURL + '/ryprofile'

function reject (msg) {
  return Promise.reject(new Error('RYProfileApi：' + msg))
}

export default {
  BaseURL,
  getmyprofile () {
    return parent.axios.get(BaseURL + '/getorcreate')
  },
  getbyry (ryid) {
    if (!ryid) {
      reject('ryid不能为空')
    }
    return parent.axios.get(BaseURL + '/getbyry/' + ryid)
  },
  get (ryprofileid) {
    if (!ryprofileid) {
      return reject('ryprofileid不能为空')
    }
    return parent.axios.get(BaseURL + '/' + ryprofileid)
  },
  update (profile) {
    if (!profile) {
      return reject('profile不能为空')
    }
    return parent.axios.put(BaseURL + '/updateinfo', profile)
  },
  approve (ksid, id) {
    if (!id) {
      return reject('id不能为空')
    }
    return parent.axios.put(BaseURL + '/approvekjsh/' + ksid, { id })
  },
  reject (ksid, id) {
    if (!id) {
      return reject('id不能为空')
    }
    return parent.axios.put(BaseURL + '/rejectkjsh/' + ksid, { id })
  },
  reedit (id) {
    if (!id) {
      return reject('id不能为空')
    }
    return parent.axios.put(BaseURL + '/reedit/' + id)
  }
  // updatePhoto (fileid) {
  //   if (!fileid) {
  //     return reject('fileid不能为空')
  //   }
  //   return parent.axios.patch(BaseURL + '/updatephoto/' + fileid)
  // },
  // delryphoto (ryid) {
  //   if (!ryid) {
  //     return reject('人员ID不能为空')
  //   }
  //   return parent.axios.patch(BaseURL + '/delryphoto/' + ryid)
  // }
}
