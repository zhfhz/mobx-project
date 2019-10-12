import userOrders from './stores/user-orders-store'
import productOrder from './stores/product-orders.store'
import order from '../../assets/img/订单 .png'

export default {
  key: 'business orders',
  path: 'order',
  title: '订单管理',
  icon: order,
  children: [
    {
      key: 'user orders',
      path: 'userOrder',
      title: '用户订单',
      page: () => import('./user-orders'),
      store: {
        key: 'userOrders',
        value: userOrders,
      },
    },
    {
      key: 'product orders',
      path: 'productOrder',
      title: '生产订单',
      page: () => import('./product-orders'),
      store: {
        key: 'productOrder',
        value: productOrder,
      },
    },
  ],
}
