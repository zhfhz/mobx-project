import companyInfo from './stores/company-info-store'
import asset from './stores/asset-store'
import user from '../../assets/img/账户.png'

export default {
  key: 'account manage',
  path: 'account',
  title: '账户管理',
  icon: user,
  children: [
    {
      key: 'company info',
      path: 'company',
      title: '公司信息',
      page: () => import('./company-info'),
      store: {
        key: 'companyInfo',
        value: companyInfo,
      },
    },
    {
      key: 'my asset',
      path: 'asset',
      title: '我的资产',
      page: () => import('./asset'),
      store: {
        key: 'asset',
        value: asset,
      },
      children: [
        {
          key: 'withdraw money',
          path: 'withdraw',
          title: '提现',
          page: () => import('./withdraw'),
          store: {
            key: 'asset',
            value: asset
          }
        }
      ]
    },
  ],
}
