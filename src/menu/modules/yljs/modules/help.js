import Constants from './Constants'

export default function (user) {
  return {
    title: '帮助',
    icon: 'sitemap',
    children: [
      { path: `${Constants.BaseUrl}/help/about`, title: '关于本站' }
    ]
  }
}
