export default {
  path: '/yljs',
  title: '医疗技术',
  icon: 'flask',
  children: (pre => [
    { path: `${pre}index`, title: '首页', icon: 'home' },
    {
      title: '人员',
      icon: 'table',
      children: [
        { path: `${pre}ry`, title: '我的信息' },
        { path: `${pre}ry/profile`, title: '人员资料' },
        { path: `${pre}ry/js`, title: '我的技术' },
        { path: `${pre}ry/js/create`, title: '申请技术授权' },
        { path: `${pre}ry/ks`, title: '我的科室' },
        { path: `${pre}ry/ks/rksq`, title: '入科申请' },
        { path: `${pre}ry/search`, title: '查找本院人员' }
      ]
    },
    {
      title: '科室',
      icon: 'table',
      children: [
        { path: `${pre}ks`, title: '科室信息' },
        { path: `${pre}ks/js`, title: '科室技术信息' },
        { path: `${pre}ks/js/create`, title: '科室技术维护' },
        { path: `${pre}ks/list`, title: '全院科室列表' },
        { path: `${pre}ks/ry`, title: '科室人员列表' }
      ]
    },
    {
      title: '技术',
      icon: 'table',
      children: [
        { path: `${pre}js`, title: '技术信息' },
        { path: `${pre}js/search`, title: '查询技术信息' }
      ]
    },
    {
      title: '人员技术',
      icon: 'table',
      children: [
        { path: `${pre}ryjs/search`, title: '查询人员技术' }
      ]
    },
    {
      title: '科室技术',
      icon: 'table',
      children: [
        { path: `${pre}ksjs`, title: '科室技术' }
      ]
    },
    {
      title: '角色管理',
      icon: 'table',
      children: [
        { path: `${pre}ryrole`, title: '人员角色' }
      ]
    }
  ])('/yljs/')
}
