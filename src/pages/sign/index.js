import login from './stores/login'
import register from './stores/register'
import reset from './stores/reset'
import checkinfo from './stores/check-info'

export default [
  {
    key: 'sign/login',
    path: 'login',
    page: () => import('./login'),
    footer: true,
    store: {
      key: 'login',
      value: login,
    },
  },
  {
    key: 'sign/register',
    path: 'register',
    page: () => import('./register'),
    footer: true,
    store: {
      key: 'register',
      value: register
    }
  },
  {
    key: 'sign/reset',
    path: 'reset',
    page: () => import('./reset'),
    store: {
      key: 'reset',
      value: reset
    }
  },
  {
    key: 'sign/certificate',
    path: 'certificate',
    page: () => import('./check-info'),
    store: {
      key: 'checkinfo',
      value: checkinfo
    }
  },
  {
    key: 'sign/waitaudit',
    path: 'waitaudit',
    page: () => import('./wait-audit'),
  },
  {
    key: 'sign/auditfailed',
    path: 'auditfailed',
    page: () => import('./register-failed')
  }
]
