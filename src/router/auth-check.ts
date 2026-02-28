import { useCookies } from 'vue3-cookies';
import { NavigationGuardNext, RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router';
import { STORAGE_AUTH_TOKEN } from '@/utils/constants';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { Routes } from './router.links';

const { LOGIN, CHATS, DASHBOARD } = Routes;

export default (
  to: RouteLocationNormalized,
  _: RouteLocationNormalizedLoaded,
  next: NavigationGuardNext,
) => {
  const $can = useCan();
  const { cookies } = useCookies();
  const token = cookies.get(STORAGE_AUTH_TOKEN);
  if (!token && to.name !== LOGIN.name) {
    next({ name: LOGIN.name });
  } else if (token && to.name === LOGIN.name) {
    if ($can(PermissionEnum.GET_CHATS_LIST)) next({ name: CHATS.name });
    else next({ name: DASHBOARD.name });
    next({ name: CHATS.name });
  } else {
    next();
  }
};
