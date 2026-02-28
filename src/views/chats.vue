<script lang="ts" setup>
import ChatLeadDetails from '@/components/pages/chats/lead/ChatLeadDetails.vue';
import ChatsList from '@/components/pages/chats/list/ChatsList.vue';
import ChatItem from '@/components/pages/chats/ChatItem.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import {
  computed,
  onMounted, ref, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { LoginSessionServiceInstance } from '@/services/login-session';
import {
  Chat,
  ChatFullInfo, ChatResponsible, ChatServiceInstance, FetchChatsParams,
} from '@/services/chat';
import { FullLeadInfo, LeadServiceInstance } from '@/services/lead';
import { useChatStore } from '@/stores/useChatStore';
import { PermissionEnum } from '@/utils/permission/enums';
import { useCan } from '@/utils/permission/can';
import { Grid } from 'ant-design-vue';
import router from '@/router';

const { useBreakpoint } = Grid;
const screens = useBreakpoint();

const route = useRoute();
const chatStore = useChatStore();
const $can = useCan();

LoginSessionServiceInstance.getLoginSessions({});

const chatFullInfo = ref<ChatFullInfo>();
const isLeadLoading = ref(false);
const showLeadInfo = ref(false);
const showChatList = ref(false);
const activeLead = ref<FullLeadInfo>();
const activeChat = ref<Partial<Chat>>({});

const id = computed(() => {
  const validId = Number(route.query.chatId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const openLeadInfo = computed(() => {
  if (screens.value?.xxl || screens.value?.xl) return true;
  return !!(!screens.value?.xxl && !screens.value?.xl && showLeadInfo.value);
});

const openChatList = computed(() => {
  if (screens.value?.xl || screens.value?.xxl || screens.value?.md || screens.value?.lg) return true;
  return !!(showChatList.value && (screens.value?.xs || screens.value?.sm));
});

const getChatById = async () => {
  if (!activeChat.value?.id) return;
  try {
    chatFullInfo.value = await ChatServiceInstance.getChat(activeChat.value.id);
    if (chatFullInfo.value.responsible === ChatResponsible.AI) {
      chatStore.setActiveTab(chatFullInfo.value.responsible);
      if (chatStore.chatList[chatFullInfo.value.responsible]?.length) return;
      await chatStore.getChatList({ responsible: chatFullInfo.value.responsible });
      const { chatId } = route.query;
      if (typeof chatId === 'string') {
        const currentChatId = Number(chatId);
        const foundChat = chatStore.chatList[chatStore.activeTab].find((p) => p.id === currentChatId);
        if (foundChat) {
          chatStore.setActiveChat(foundChat);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchLead = async () => {
  if (!activeChat.value?.leadId) return;
  isLeadLoading.value = true;
  try {
    activeLead.value = await LeadServiceInstance.getLead(activeChat.value.leadId);
  } catch (err) {
    console.error(err, 'fetchLead()');
  } finally {
    isLeadLoading.value = false;
  }
};

const changeResponsible = (filter?: FetchChatsParams) => {
  if (!filter?.responsible) return;
  chatStore.setActiveTab(filter.responsible);
  if (!chatStore.chatList[filter.responsible]?.length) {
    chatStore.getChatList({ ...filter });
  }
};

const resetFilter = (responsible: ChatResponsible) => {
  chatStore.setPage(1);
  chatStore.getChatList({ responsible }, true);
};

const changeAi = async () => {
  const { chatId: changedChatId } = route.query;
  if (!changedChatId) return;
  const changedChat = chatStore.chatList[chatStore.activeTab].find((item) => item.id === +changedChatId);
  if (!changedChat) return;
  if (chatStore.activeTab === ChatResponsible.WORKER) {
    chatStore.setActiveTab(ChatResponsible.AI);
    chatStore.setChatList(ChatResponsible.WORKER, chatStore.chatList[ChatResponsible.WORKER].filter((item) => item.id !== +changedChatId));
    if (!chatStore.chatList[ChatResponsible.AI]?.length) {
      chatStore.setPage(1);
      await chatStore.getChatList({ responsible: ChatResponsible.AI });
    } else {
      chatStore.unshiftChat(changedChat);
    }
  } else {
    chatStore.setActiveTab(ChatResponsible.WORKER);
    chatStore.setChatList(ChatResponsible.AI, chatStore.chatList[ChatResponsible.AI].filter((item) => item.id !== +changedChatId));
    if (!chatStore.chatList[ChatResponsible.WORKER]?.length) {
      chatStore.setPage(1);
      await chatStore.getChatList({ responsible: ChatResponsible.WORKER });
    } else {
      chatStore.unshiftChat(changedChat);
    }
  }
};

const changeChat = (chat: Partial<Chat>, mustUpdate?: boolean) => {
  const newChatList = chatStore.chatList[chatStore.activeTab].map((item) => {
    if (item.id === chat.id) {
      return { ...item, unreadMessagesCount: 0 };
    }
    return item;
  });
  activeChat.value = chat;
  chatStore.setChatList(chatStore.activeTab, newChatList);
  if (route.query?.chatId && +route.query.chatId === chat.id && !mustUpdate) return;
  if (chat?.id) chatStore.updateChatId(chat.id);
  getChatById();
  fetchLead();
};

const backToChats = () => {
  showChatList.value = true;
  router.replace('/chats');
  activeChat.value = {};
};

watch(() => id.value, (newValue) => {
  if (newValue) {
    let chat: Partial<Chat> | Chat | undefined = chatStore.chatList[chatStore.activeTab].find((item) => item.id === +newValue);
    if (!chat && id.value && route.query.leadId) chat = { id: +id.value, leadId: +route.query.leadId };
    if (chat?.id) {
      changeChat(chat as Partial<Chat>, true);
    }
    showChatList.value = false;
  } else {
    showChatList.value = true;
    activeChat.value = {};
  }
});

onMounted(async () => {
  const { chatId: activeChatId, leadId: activeLeadId } = route.query;
  if (activeChatId) activeChat.value.id = +activeChatId;
  if (activeLeadId) activeChat.value.leadId = +activeLeadId;
  if (activeChatId) chatStore.updateChatId(+activeChatId);
  if (!activeChatId) showChatList.value = true;
  chatStore.setActiveTab(ChatResponsible.WORKER);
  getChatById().then();
  fetchLead().then();
  if (!chatStore.chatList[chatStore.activeTab].length) {
    await chatStore.getChatList({ responsible: ChatResponsible.WORKER });
    const { chatId } = route.query;
    if (typeof chatId === 'string') {
      const currentChatId = Number(chatId);
      const foundChat = chatStore.chatList[chatStore.activeTab].find((p) => p.id === currentChatId);
      if (foundChat) {
        chatStore.setActiveChat(foundChat);
      }
    }
  }
});
</script>

<template>
  <div class="chat-container">
    <ChatsList
      v-if="openChatList"
      class="chat-list"
      :chat-list="chatStore.chatList[chatStore.activeTab]"
      :loading="chatStore.getChatLoading"
      @change-responsible="changeResponsible"
      @reset-filter="resetFilter"
      @change-chat="changeChat"
    />
    <ChatItem
      v-show="activeChat?.id && !showLeadInfo"
      :chat-full-info="chatFullInfo"
      :active-lead="activeLead"
      :loading="isLeadLoading"
      class="chat-content"
      @change-ai="changeAi"
      @update-lead="fetchLead"
      @show-lead-info="showLeadInfo = true"
      @back-chat-list="backToChats"
    />
    <ChatLeadDetails
      v-if="activeChat?.id && $can(PermissionEnum.VIEW_CHAT_DETAILS) && openLeadInfo"
      :active-lead="activeLead"
      :active-lead-loading="isLeadLoading"
      :chat-full-info="chatFullInfo"
      class="chat-lead"
      @update-lead="fetchLead"
      @close-lead-info="showLeadInfo = false"
    />
    <BaseCard
      v-else-if="!screens?.xs && !id"
      class="chats-empty-text text-gray-400 text-base flex items-center justify-center mb-5"
    >
      Select a chat to start messaging
    </BaseCard>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/pages/chats";
</style>
