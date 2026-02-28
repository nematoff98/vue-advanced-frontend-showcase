import { Routes } from './router.links';

const { CHATS } = Routes;

export default [
  {
    path: CHATS.path,
    name: CHATS.name,
    meta: CHATS.meta,
    component: () => import('@/views/chats.vue'),
  },
];
