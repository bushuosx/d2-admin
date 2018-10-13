import Constants from './Constants'

export default function (user) {
  return {
    title: '帮助',
    icon: 'sitemap',
    children: [
      { path: `${Constants.BaseUrl}/ry/ks/rysh`, title: '入科审核' }
    ]
  }
}
