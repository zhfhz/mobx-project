import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();
export const routerStore = new RouterStore();

export const history = syncHistoryWithStore(browserHistory, routerStore);
