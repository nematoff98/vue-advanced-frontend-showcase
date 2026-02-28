<template>
  <a-layout class="bg-gray-50" style="min-height: 100vh">
    <a-drawer
      v-if="isMobile"
      :open="drawerOpen"
      placement="left"
      :width="SIDEBAR_WIDTH"
      class="sidebar-drawer"
      :closable="false"
      @close="drawerOpen = false"
      :get-container="false"
      :body-style="{ padding: 0 }"
      :mask-closable="true"
    >
      <Sidebar />
    </a-drawer>
    <a-layout-sider
      v-else
      v-model:collapsed="collapsed"
      :trigger="null"
      class="text-sm whitespace-nowrap h-[100vh] z-20"
      :collapsed-width="collapsedWidth"
      collapsible
      breakpoint="xs"
      :mask-closable="true"
      :width="SIDEBAR_WIDTH"
    >
      <Sidebar v-model:collapse="collapsed" />
    </a-layout-sider>
    <a-layout class="overflow-y-hidden h-screen">
      <LayoutHeader @open-sidebar="drawerOpen = true" />
      <a-layout-content class="layout-content overflow-y-auto  mx-4 mt-4 mb-0">
        <router-view />
      </a-layout-content>
    </a-layout>
    <audio id="remoteMedia" autoplay="true">
      <track kind="captions" />
    </audio>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  computed,
  onMounted, onUnmounted, ref, watch,
} from 'vue';
import { useCurrentUserStore } from '@/stores/useCurrentUser';
import { pusherInstance } from '@/plugins/pusher';
import { ChatMessageSocket, ParticipantType } from '@/services/chat';
import { useCallCenterStore } from '@/stores/call/call.center';
import { useChatStore } from '@/stores/useChatStore';
import { useUnknownChatStore } from '@/stores/useUnknownChatStore';
import type { OrganizationSetupGuide } from '@/services/organization';
import LayoutHeader from '@/components/layout/LayoutHeader.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import { useRoute } from 'vue-router';
import { Routes } from '@/router/router.links';

const { CHATS } = Routes;

const user = useCurrentUserStore();
const callCenter = useCallCenterStore();
const chatStore = useChatStore();
const unknownChatStore = useUnknownChatStore();
const route = useRoute();

const SIDEBAR_WIDTH = 264;
const MOBILE_HIDE_UNTIL = 540;

const collapsed = ref(false);
const drawerOpen = ref(false);
const setupGuides = ref<OrganizationSetupGuide[]>([]);
const collapsedWidth = ref('72px');

const width = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1920);
const isMobile = computed(() => width.value < MOBILE_HIDE_UNTIL);

watch(() => route.path, () => {
  drawerOpen.value = false;
});

watch(() => route.query, (newValue, oldValue) => {
  if (route.path === CHATS.path && oldValue.leadId && !newValue.leadId) {
    drawerOpen.value = false;
  }
});

const updateSidebarCollapse = () => {
  collapsed.value = window.innerWidth < 1600;
  if (window.innerWidth < 540) {
    collapsedWidth.value = '0px';
  } else {
    collapsedWidth.value = '72px';
  }
};

const connectSocket = () => {
  if (user.currentUser) {
    setTimeout(() => {
      const channel = pusherInstance.subscribe(
        `private-workers.${user.currentUser?.id}`,
      );
      channel.bind('new_message', (data: ChatMessageSocket) => {
        console.info(data, 'new_message');
        const message = {
          ...data,
          id: data.chatMessageId,
        };
        message.chat.unreadMessagesCount += 1;
        if (!message?.chat) return;
        if (message.participantType === ParticipantType.UNKNOWN || message.participantType === ParticipantType.DRIVER) {
          unknownChatStore.upChatForSocket(message.chat);
          unknownChatStore.checkAndReplaceOrPushMessage(message);
        } else {
          chatStore.chatUpToTop(message.chat);
          chatStore.checkAndReplaceOrPushMessage(message);
        }
      });
      channel.bind('update_message', (data: ChatMessageSocket) => {
        console.info(data, 'update_message');
        const message = {
          ...data,
          id: data.chatMessageId,
        };
        if (!message?.chat) return;
        if (message.participantType === ParticipantType.UNKNOWN || message.participantType === ParticipantType.DRIVER) {
          unknownChatStore.checkAndReplaceOrPushMessage(message);
        } else chatStore.checkAndReplaceOrPushMessage(message);
      });

      channel.bind('setup_guide_resolved', (data: {guides: OrganizationSetupGuide[]}) => {
        setupGuides.value = data.guides;
      });
    }, 1000);
  }
};

onMounted(async () => {
  updateSidebarCollapse();
  window.addEventListener('resize', updateSidebarCollapse);
  connectSocket();
  callCenter.start();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSidebarCollapse);
});
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/ui/default-layout";
</style>
