import ChatAboutStore from './stores/chat-about';
import ChatHistoryStore from './stores/chat-history';
import ChatListStore from './stores/chat-list';
import ChatSenderStore from './stores/chat-sender';
import ChatAppStore from './stores/chat-app';

export default {
  key: 'chat management',
  path: '/chat/:groupId?/:targetName?',
  page: () => import('./chat-2'),
  store: {
    key: 'chatApp',
    value: ChatAppStore
  },
  children: [
    {
      // path: '/parent',
      store: {
        key: 'chatApp',
        value: ChatAppStore
      }
    },
    {
      // path: '/parent',
      store: {
        key: 'chatAbout',
        value: ChatAboutStore
      }
    },
    {
      // path: '/parent',
      store: {
        key: 'chatHistory',
        value: ChatHistoryStore
      }
    },
    {
      // path: '/parent',
      store: {
        key: 'chatList',
        value: ChatListStore
      }
    },
    {
      // path: '/parent',
      store: {
        key: 'chatSender',
        value: ChatSenderStore
      }
    }
  ]
};
