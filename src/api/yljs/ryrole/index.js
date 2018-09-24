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
  }
}
