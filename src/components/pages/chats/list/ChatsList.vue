<script lang="ts" setup>
import ChatsListHeader from '@/components/pages/chats/list/ChatsListHeader.vue';
import ChatsListItem from '@/components/pages/chats/list/ChatsListItem.vue';
import ChatListSkeleton from '@/components/pages/chats/ChatListSkeleton.vue';
import { Chat, ChatResponsible, FetchChatsParams } from '@/services/chat';
import { ref, watch } from 'vue';
import { useChatStore } from '@/stores/useChatStore';

const chatStore = useChatStore();

interface PropsTypes {
  chatList: Chat[];
  loading: boolean;
}

interface ChatListEmits {
  // (e: 'filter', filter: FetchChatsParams): void
  (e: 'change-responsible', filter: FetchChatsParams): void
  (e: 'change-page'): void
  (e: 'reset-filter', responsible: ChatResponsible): void
  (e: 'change-chat', chat: Chat): void
}

const props = defineProps<PropsTypes>();
const emits = defineEmits<ChatListEmits>();

const tabs = ref([
  {
    id: ChatResponsible.WORKER,
    text: 'Broker',
  },
  {
    id: ChatResponsible.AI,
    text: 'AI chats',
  },
]);
const scrollContainer = ref();
const activeResponsible = ref<ChatResponsible>(ChatResponsible.WORKER);
const activeFilter = ref<FetchChatsParams>({});

watch(() => chatStore.activeTab, (newValue) => {
  activeResponsible.value = newValue;
});

const filter = (headerFilter: FetchChatsParams) => {
  activeFilter.value = {
    ...activeFilter.value,
    ...headerFilter,
    responsible: activeResponsible.value,
  };
  chatStore.getChatList(activeFilter.value, true);
  // emits('filter', activeFilter.value);
};

const handleTabChange = (responsible: ChatResponsible) => {
  emits('change-responsible', { responsible });
};

const scrollList = () => {
  const container = scrollContainer;
  const scrollPosition = container.value.scrollTop;
  const containerHeight = container.value.clientHeight;
  const contentHeight = container.value.scrollHeight;
  if (
    scrollPosition + containerHeight + 200 >= contentHeight
    && !props.loading
  ) {
    chatStore.changePage();
  }
};

const changeActiveChat = (chat: Chat): void => {
  chatStore.setActiveChat(chat);
  emits('change-chat', chat);
};
</script>

<template>
  <section
    class="bg-white dark:bg-gray-800 rounded-2xl overflow-y-auto max-h-full"
    ref="scrollContainer"
  >
    <a-tabs v-model:activeKey="activeResponsible" class="tab-button" @change="handleTabChange">
      <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.text">
        <ChatsListHeader @filter="filter" @reset-filter="emits('reset-filter', activeResponsible)" />
        <ul
          @scroll="scrollList"
          class="overflow-y-auto max-h-full"
        >
          <li v-if="loading">
            <ChatListSkeleton />
          </li>
          <template v-else>
            <li
              v-for="chat in chatList"
              :key="chat.id"
            >
              <ChatsListItem
                :chat="chat"
                @click="changeActiveChat(chat)"
              />
            </li>
          </template>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>
