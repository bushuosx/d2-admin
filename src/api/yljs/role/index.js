import parent from '../index'
const BaseURL = parent.BaseURL + '/role'

function reject (msg) {
  return Promise.reject(new Error('RoleApi：' + msg))
}

export default {
  BaseURL,
  getrolelist () {
    return parent.axios.get(BaseURL + '/getall')
  },
  getrole (roleid) {
    if (roleid === null || roleid === undefined || roleid === '') {
      return reject('roleid不能为空')
    }
    return parent.axios.get(BaseURL + '/' + roleid)
  }
}
