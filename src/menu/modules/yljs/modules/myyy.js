export default function () {
  return {
    title: '医院公共信息',
    icon: 'table',
    children: [
      { path: `ks/list`, title: '全院科室列表' },
      { path: `ry/search`, title: '院内人员查询' }
    ]
  }
}
