import product from './stores/product'
import choose from '../../assets/img/选择.png'

export default {
  key: 'choose designer',
  path: 'design',
  title: '选择设计',
  icon: choose,
  children: [
    {
      key: 'waitting choose',
      path: 'choose',
      title: '待选择',
      page: () => import('./product'),
      store: {
        key: 'product',
        value: product,
      },
      children: [
        {
          path: 'detail/:id?',
          page: () => import('./details'),
          store: {
            key: 'details',
            value: product,
          }
        },
        {
          path: 'cooperation/:id',
          page: () => import('./cooperation'),
          store: {
            key: 'cooperation',
            value: product,
          }
        }
      ],
    },
  ],
}
