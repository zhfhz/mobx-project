import _ from 'lodash';
import product from './choose-design';
import goods from './goods-manage';
import busOrder from './order-manage';
import account from './account-manage';
import homePage from './home-page';
import sign from './sign';
import exception from './exception';
import chat from './chat';

/**
 * 解析 store 配置
 */
function _extractStore ({ children, store }) {
  if (!children || !children.length) {
    return { [store.key]: store.value };
  }
  return _.chain(children)
    .flatMap(({ store, children }) => {
      const stores = [];
      if (store && store.key && store.value) stores.push(store);
      if (children && children.length) {
        stores.push(...children.filter(it => it.store && it.store.key && it.store.value).map(it => it.store));
      }
      return stores;
    })
    .keyBy('key')
    .mapValues('value')
    .value();
}

export const stores = {
  ..._extractStore(product),
  ..._extractStore(goods),
  ..._extractStore(busOrder),
  ..._extractStore(account),
  ..._extractStore(homePage),
  ..._extractStore({ children: sign }),
  ..._extractStore(chat)
};

export const menus = [homePage, product, goods, busOrder, account];

/**
 * 构建路由
 */
function _exactRoutes () {
  const routes = [];
  menus.forEach(subMenu => {
    if (subMenu.children) {
      subMenu.children.forEach(menuItem => {
        routes.push({
          path: ['', subMenu.path, menuItem.path].join('/'),
          page: menuItem.page,
          exact: _.isUndefined(menuItem.exact) ? true : menuItem.exact
        });

        if (menuItem.children && menuItem.children.length) {
          menuItem.children.forEach(lowest => {
            routes.push({
              path: ['', subMenu.path, menuItem.path, lowest.path].join('/'),
              page: lowest.page,
              exact: _.isUndefined(menuItem.exact) ? true : menuItem.exact
            });
          });
        }
      });
    } else {
      routes.push({
        path: ['', subMenu.path].join('/'),
        page: subMenu.page,
        exact: _.isUndefined(subMenu.exact) ? true : subMenu.exact
      });
    }
  });

  // 添加聊天页面路由
  routes.push({
    path: ['', chat.path].join('/'),
    page: chat.page,
    exact: _.isUndefined(chat.exact) ? true : chat.exact
  });

  // 添加异常页面路由
  routes.push({
    path: ['', exception.path].join('/'),
    page: exception.page,
    exact: _.isUndefined(exception.exact) ? true : exception.exact
  });
  return routes;
}

export const routes = _exactRoutes();

export const unsignedRoutes = sign.map(it => ({
  path: ['', 'sign', it.path].join('/'),
  page: it.page,
  exact: true
}));

export const chatRoute = chat;
