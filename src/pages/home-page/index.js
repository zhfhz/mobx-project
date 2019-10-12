import homePage from './stores/home-page-store'
import home from '../../assets/img/首页 .png'

export default {
  key: 'home page',
  path: 'homePage',
  title: '系统首页',
  icon: home,
  page: () => import('./home-page'),
  store: {
    key: 'homePage',
    value: homePage,
  },
}
