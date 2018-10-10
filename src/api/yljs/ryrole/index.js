import parent from '../index'
const BaseURL = parent.BaseURL + '/ryrole'

function reject (msg) {
  return Promise.reject(new Error('RYRoleApi：' + msg))
}

export default {
  BaseURL,
  getbyry (ryid) {
    if (ryid === null || ryid === undefined || ryid === '') {
      return reject('ryid不能为空')
    }
    return parent.axios.get(BaseURL + '/getbyry/' + ryid)
  },
  getrolesofry (ryid) {
    if (!ryid) {
      return reject('ryid不能为空')
    }
    return parent.axios.get(BaseURL + '/getrolesofry/' + ryid)
  },
  getmyallroles () {
    return parent.axios.get(BaseURL + '/getallrolesofry/' + parent.getUserId())
  },
  getmyroles () {
    return parent.axios.get(BaseURL + '/getbyry/' + parent.getUserId())
  },
  getbyrole (roleid) {
    if (roleid === null || roleid === undefined || roleid === '') {
      return reject('roleid不能为空')
    }
    return parent.axios.get(BaseURL + '/getbyrole/' + roleid)
  },
  updaterolesofry (ryid, roleidlist) {
    if (ryid === null || ryid === undefined || ryid === '') {
      return reject('ryid不能为空')
    }
    if (roleidlist === null || roleidlist === undefined || roleidlist.length === undefined) {
      return reject('roleidlist不能为空')
    }
    return parent.axios.post(BaseURL + '/updaterolesofry', { ryid, roleidlist })
  },
  supertome () {
    return parent.axios.post(BaseURL + '/supertome', { ryid: parent.getUserId() })
  }
}
