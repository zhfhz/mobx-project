import presell from './stores/presell-store'
import goodsList from './stores/goods-list-store'
import preOrder from './stores/preOrders-store'
import detail from './stores/detail.store'
import goods from '../../assets/img/商品.png'

export default {
  key: 'goods manage',
  path: 'goods',
  title: '商品管理',
  icon: goods,
  children: [
    {
      key: 'goods presell',
      path: 'presell',
      title: '商品众测',
      page: () => import('./presell'),
      store: {
        key: 'presell',
        value: presell,
      },
      children: [
        {
          key: 'goods preorders',
          path: 'preOrder/:id/:state',
          title: '预售订单',
          page: () => import('./preOrders'),
          store: {
            key: 'preOrder',
            value: preOrder,
          },
        },
        {
          key: 'goods details',
          path: 'predetail/:id',
          title: '商品详情',
          page: () => import('./preDetail'),
          store: {
            key: 'detail',
            value: detail,
          },
        }
      ]
    },
    {
      key: 'goods list',
      path: 'list',
      title: '常规商品',
      page: () => import('./goods-list'),
      store: {
        key: 'goodsList',
        value: goodsList,
      },
      children: [
        {
          key: 'goods preorders',
          path: 'order/:id',
          title: '常规订单',
          page: () => import('./orders'),
          store: {
            key: 'preOrder',
            value: preOrder,
          },
        },
        {
          key: 'goods details',
          path: 'detail/:id',
          title: '商品详情',
          page: () => import('./detail'),
          store: {
            key: 'detail',
            value: detail,
          },
        }
      ]
    },
  ],
}
