import Constants from './Constants'

export default function () {
  return {
    title: '医院公共信息',
    icon: 'building',
    children: [
      { path: `${Constants.BaseUrl}/ks/list`, icon: 'cubes', title: '全院科室列表' },
      { path: `${Constants.BaseUrl}/report/jsreport`, icon: 'cubes', title: '全院技术报表' },
      { path: `${Constants.BaseUrl}/js/search`, icon: 'users', title: '院内已授权技术' },
      { path: `${Constants.BaseUrl}/ry/search`, icon: 'users', title: '院内人员查询' }
    ]
  }
}
