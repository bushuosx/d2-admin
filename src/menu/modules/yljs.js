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
        { path: `${pre}ry`, title: '人员信息' }

      ]
    },
    {
      title: '人员技术',
      icon: 'table',
      children: [
        { path: `${pre}ryjs/create`, title: '申请技术' }
      ]
    }
  ])('/yljs/')
}
