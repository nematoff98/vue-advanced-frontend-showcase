import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  Chat,
  ChatMessage, ChatResponsible, ChatServiceInstance, FetchChatsParams, GetChatMessagesParams, MessageStatus,
} from '@/services/chat';
import { prepareMessages } from '@/utils';

interface ChatListWithTab {
  [ChatResponsible.AI]: Chat[];
  [ChatResponsible.WORKER]: Chat[];
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([]);
  const morePage = ref<boolean>(false);
  const getChatLoading = ref<boolean>(false);
  const chatId = ref<number>();
  const isHasMorePages = ref(false);
  const activeTab = ref<ChatResponsible>(ChatResponsible.WORKER);
  const page = ref(1);
  const getMessageLoading = ref(false);
  const activeChat = ref<Chat>();

  const chatList = ref<ChatListWithTab>({
    [ChatResponsible.WORKER]: [],
    [ChatResponsible.AI]: [],
  });

  const getChatList = async (filter?: FetchChatsParams, isFilter?: boolean) => {
    getChatLoading.value = true;
    try {
      const { items, hasMorePages } = await ChatServiceInstance.getChatList({
        ...filter,
        responsible: filter?.responsible || ChatResponsible.WORKER,
        page: page.value,
      });
      if (isFilter) chatList.value[filter?.responsible || activeTab.value] = items;
      else chatList.value[filter?.responsible || activeTab.value].push(...items);
      isHasMorePages.value = !!hasMorePages;
    } catch (err) {
      console.error(err);
    } finally {
      getChatLoading.value = false;
    }
  };

  const removeChatFromChats = (id: number, leadId: number, responsible: ChatResponsible) => {
    chatList.value[responsible] = chatList.value[responsible].filter((p) => (p.leadId !== leadId && p.id !== id));
  };

  const setActiveTab = (responsible: ChatResponsible) => {
    activeTab.value = responsible;
  };

  const setPage = (newPage: number) => {
    page.value = newPage;
  };

  const setActiveChat = (chat: Chat) => {
    activeChat.value = chat;
  };

  const changePage = () => {
    if (isHasMorePages.value) {
      page.value += 1;
      getChatList().then();
    }
  };

  const setChatList = (responsible: ChatResponsible, chats: Chat[]) => {
    chatList.value[responsible] = chats;
  };

  const updateChatId = (id: number) => {
    chatId.value = id;
  };

  const unshiftChat = (chat: Chat) => {
    chatList.value[activeTab.value].unshift(chat);
  };

  const chatUpToTop = (chat: Chat) => {
    const chatListWorkerIndex = chatList.value[ChatResponsible.WORKER].map((p) => p.id).indexOf(chat.id);
    if (chatListWorkerIndex > -1) {
      chatList.value[ChatResponsible.WORKER].splice(chatListWorkerIndex, 1);
      chatList.value[ChatResponsible.WORKER].unshift(chat);
    } else {
      const chatListAiIndex = chatList.value[ChatResponsible.AI].map((p) => p.id).indexOf(chat.id);
      if (chatListAiIndex > -1) {
        chatList.value[ChatResponsible.AI].splice(chatListAiIndex, 1);
        chatList.value[ChatResponsible.AI].unshift(chat);
      }
    }
  };

  const chatToTopById = (id: number) => {
    const chat = chatList.value[activeTab.value].find((p) => p.id === id);
    if (chat) {
      chatUpToTop(chat);
    }
  };

  const getMessage = async (params: GetChatMessagesParams) => {
    if (params.page === 1) messages.value = [];
    if (!messages.value.length) getMessageLoading.value = true;
    try {
      const { items, hasMorePages } = await ChatServiceInstance.getChatMessages({ ...params, reverse: 1 });
      const formattedMessages = prepareMessages(items);
      if (params.page === 1) messages.value = [];
      const newMessages = formattedMessages.reverse();
      messages.value.unshift(...newMessages);
      morePage.value = !!hasMorePages;
    } catch (err) {
      console.error(err);
    } finally {
      getMessageLoading.value = false;
    }
  };

  const addNewMessage = (message: ChatMessage) => {
    if (!chatId.value || chatId.value !== message.chatId) return;
    messages.value.push(message);
  };

  const replaceMessageByIndex = (id: string, message: ChatMessage) => {
    if (!chatId.value || chatId.value !== message.chatId) return;
    const indexMessage = messages.value.map((p) => p.id).indexOf(id);
    if (indexMessage > -1) {
      messages.value[indexMessage] = message;
    }
  };

  const checkAndReplaceOrPushMessage = (message: ChatMessage) => {
    if (chatId.value !== message.chatId) return;
    const existingMessage = messages.value.find((m) => m.id === message.id);
    if (existingMessage) {
      existingMessage.message = message.message;
    } else {
      messages.value.push(message);
    }
  };

  const updateMessageStatus = (id: number | string, status: MessageStatus) => {
    const message = messages.value.find((m) => m.id === id);
    if (message) message.status = status;
  };

  const clearChatStore = () => {
    messages.value = [];
    morePage.value = false;
    chatList.value = {
      [ChatResponsible.WORKER]: [],
      [ChatResponsible.AI]: [],
    };
    activeTab.value = ChatResponsible.WORKER;
  };

  return {
    messages,
    morePage,
    getChatLoading,
    chatList,
    activeTab,
    activeChat,
    getMessageLoading,
    getMessage,
    updateMessageStatus,
    addNewMessage,
    checkAndReplaceOrPushMessage,
    replaceMessageByIndex,
    updateChatId,
    getChatList,
    setActiveTab,
    changePage,
    setChatList,
    setActiveChat,
    unshiftChat,
    setPage,
    chatUpToTop,
    chatToTopById,
    clearChatStore,
    removeChatFromChats,
  };
});
