import { ref } from 'vue';
import { AuthServiceInstance } from '@/services/auth';
import { defineStore } from 'pinia';
import { useCookies } from 'vue3-cookies';
import { STORAGE_AUTH_TOKEN } from '@/utils/constants';
import { useRouter } from 'vue-router';
import { UserInfo } from '@/services/user';
import { Routes } from '@/router/router.links';
import { STORAGE_KEYS } from '@/utils/permission/enums';
// import { mockPermissions } from '@/mock/mock-data';

const { LOGIN } = Routes;

export const useCurrentUserStore = defineStore('currentUser', () => {
  const currentUser = ref<UserInfo | null>(null);
  const isLoading = ref(false);
  const logoutLoading = ref(false);
  const error = ref<string | null>(null);

  const { cookies } = useCookies();
  const router = useRouter();

  const fetchCurrentUser = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      currentUser.value = await AuthServiceInstance.getCurrentUser();
      if (currentUser.value.permissions) {
        localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify([...currentUser.value.permissions, 'get_lead_status_report']));
        // localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(mockPermissions));
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      isLoading.value = false;
    }
  };

  const authLogout = async () => {
    try {
      await AuthServiceInstance.logout();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
    }
  };

  const changeTF = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // currentUser.value = (await UserServiceInstance.changeTF(params)).data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    logoutLoading.value = true;
    await authLogout();
    cookies.remove(STORAGE_AUTH_TOKEN);
    await router.push({ name: LOGIN.name });
    currentUser.value = null;
    logoutLoading.value = false;
  };

  return {
    currentUser,
    isLoading,
    logoutLoading,
    error,
    fetchCurrentUser,
    logout,
    changeTF,
  };
});
