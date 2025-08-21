import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import Chat from '../views/Chat.vue';
import ComingSoon from '../views/ComingSoon.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/chat',
    children: [
      {
        path: 'chat',
        name: 'Chat',
        component: Chat,
        meta: { title: '智能问答' }
      },
      {
        path: 'asset-explorer',
        name: 'AssetExplorer',
        component: ComingSoon,
        meta: { title: '资产探查' }
      },
      {
        path: 'domain',
        name: 'Domain',
        component: ComingSoon,
        meta: { title: '主题域' }
      },
      {
        path: 'metrics',
        name: 'Metrics',
        component: ComingSoon,
        meta: { title: '指标管理' }
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
