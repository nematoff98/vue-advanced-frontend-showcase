import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import chats from './routes.chats';
import authCheck from './auth-check';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      ...chats,
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(authCheck);

export default router;
