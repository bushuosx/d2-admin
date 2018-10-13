import Constants from './Constants'

export default function () {
  return {
    title: '医院公共信息',
    icon: 'hospital-o',
    children: [
      { path: `${Constants.BaseUrl}/ks/list`, title: '全院科室列表' },
      { path: `${Constants.BaseUrl}/ry/search`, icon: 'users', title: '院内人员查询' }
    ]
  }
}
