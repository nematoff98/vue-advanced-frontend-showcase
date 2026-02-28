import Pusher from 'pusher-js';
import { useCookies } from 'vue3-cookies';
import { STORAGE_AUTH_TOKEN } from '@/utils/constants';

const { cookies } = useCookies();

const pusherKey = process.env.VUE_APP_PUSHER_APP_KEY;
if (!pusherKey) throw new Error('VUE_APP_PUSHER_APP_KEY is not defined');

const pusherCluster = process.env.VUE_APP_PUSHER_APP_CLUSTER;
if (!pusherCluster) throw new Error('VUE_APP_PUSHER_APP_CLUSTER is not defined');

export const pusherInstance = new Pusher(pusherKey, {
  cluster: pusherCluster,
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],
  channelAuthorization: {
    endpoint: `${process.env.VUE_APP_BASE_URL_NEW}/broadcasting/auth`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${cookies.get(STORAGE_AUTH_TOKEN) || ''}`,
    },
    transport: 'ajax',
  },
});

export const stopPusher = () => {
  if (!pusherInstance) return;
  try {
    pusherInstance.channels?.all()?.forEach((ch) => {
      try { ch?.unbind_all?.(); } catch (error) {
        console.error('Pusher unbind_all error:', error);
      }
      try { pusherInstance?.unsubscribe?.(ch?.name); } catch (error) {
        console.error('Pusher unsubscribe error:', error);
      }
    });
  } catch (error) {
    console.error('Pusher channel all forEach error:', error);
  }
  try { pusherInstance.disconnect(); } catch (err) {
    console.error('Pusher disconnect error:', err);
  }
};
