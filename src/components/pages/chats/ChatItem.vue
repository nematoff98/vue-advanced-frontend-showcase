<script lang="ts" setup>
import ChatItemContentForm from '@/components/pages/chats/ChatItemContentForm.vue';
import ChatItemContent from '@/components/pages/chats/ChatItemContent.vue';
import ChatItemHeader from '@/components/pages/chats/ChatItemHeader.vue';
import {
  ChatFullInfo,
  ChatMessage,
  ChatMessageType,
  ChatServiceInstance,
  MessageChannel,
  MessageSender,
  SendMessageFormState,
  TempMessage,
  MessageStatus,
} from '@/services/chat';
import {
  computed, onMounted, ref, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useErrorNotification } from '@/composables/useErrorNotification';
import { PageableRequestParams } from '@/services/general';
import { FullLeadInfo } from '@/services/lead';
import { useChatStore } from '@/stores/useChatStore';
import { v4 as uuidv4 } from 'uuid';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { formattedDate } from '@/utils';

const route = useRoute();
const useErrorNotify = useErrorNotification();
const chatStore = useChatStore();
const $can = useCan();

interface ChatItemProps {
  chatFullInfo?: ChatFullInfo
  activeLead?: FullLeadInfo
  loading?: boolean
}

interface Emits {
  (e: 'change-ai'): void
  (e: 'update-lead'): void
  (e: 'show-lead-info'): void
  (e: 'back-chat-list'): void
}

const props = defineProps<ChatItemProps>();
const emits = defineEmits<Emits>();

const channel = ref<MessageChannel>(MessageChannel.SMS);
const replyMessage = ref<ChatMessage | undefined>(undefined);
const scrollToBottom = ref(false);
const getFirstMessageLoading = ref(false);
const messageParams = ref<PageableRequestParams>({
  perPage: 15,
  page: 1,
});

const contacts = computed(() => props.chatFullInfo?.chatContacts?.filter((p) => p.channel !== MessageChannel.CALL));

const scrollTo = () => {
  scrollToBottom.value = true;
  setTimeout(() => {
    scrollToBottom.value = false;
  }, 1000);
};

const getChatMessages = async (page?: number) => {
  const { chatId } = route.query;
  if (!chatId) return;
  getFirstMessageLoading.value = true;
  try {
    await chatStore.getMessage({
      chat_id: +chatId,
      page: page ?? messageParams.value.page,
      per_page: messageParams.value.perPage,
    });
    if ((!page || page === 1) && messageParams.value?.page && messageParams.value.page === 1) scrollTo();
  } catch (err) {
    useErrorNotify.showErrorNotification(err);
  } finally {
    getFirstMessageLoading.value = false;
  }
};

const getFormData = (newMessage: SendMessageFormState): FormData => {
  const newFormData = new FormData();
  newFormData.append('chat_id', newMessage.chat_id.toString());
  if (newMessage.message) newFormData.append('message', newMessage.message);
  newFormData.append('channel', newMessage.channel);
  if (newMessage.attachments?.length) {
    Array.from(newMessage.attachments).forEach((file, i) => {
      newFormData.append(`attachments[${i}]`, file);
    });
  }
  if (newMessage.subject) newFormData.append('subject', newMessage.subject);
  if (newMessage?.messageTemplateId) newFormData.append('message_template_id', `${newMessage.messageTemplateId}`);
  return newFormData;
};

const sendMessage = async (message: TempMessage, templateChannel?: MessageChannel) => {
  if (!route.query.chatId) return;
  if (templateChannel) channel.value = templateChannel;
  chatStore.updateChatId(+route.query.chatId);
  scrollTo();
  const messageId = uuidv4();
  try {
    chatStore.addNewMessage({
      message: message.message || '',
      sender: MessageSender.WORKER,
      attachments: message.attachments?.length ? message.attachments : [],
      messageType: message.attachments?.length ? ChatMessageType.FILE : ChatMessageType.TEXT,
      createdAt: formattedDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      channel: channel.value,
      chatId: +route.query.chatId,
      status: MessageStatus.WAITING,
      id: messageId,
    });
    chatStore.chatToTopById(+route.query.chatId);
    const newMessageForSending = {
      chat_id: +route.query.chatId,
      message: message.message || '',
      attachments: message.files,
      subject: message.subject,
      channel: channel.value,
      messageTemplateId: message.messageTemplateId,
    } as SendMessageFormState;
    const newFormData = getFormData(newMessageForSending);
    const responseMessage = await ChatServiceInstance.sendMessage(newFormData);
    chatStore.replaceMessageByIndex(messageId, responseMessage);
    scrollTo();
  } catch (err) {
    useErrorNotify.showErrorNotification(err);
    chatStore.updateMessageStatus(messageId, MessageStatus.ERROR);
  }
};

const changeChannel = (newChannel: MessageChannel) => {
  channel.value = newChannel;
};

const clickReply = (message: ChatMessage) => {
  replyMessage.value = message;
};

const getMessageOnScroll = async (event: Event) => {
  const target = event.target as Element;
  const oldScrollHeight = target.scrollHeight;
  if (target.scrollTop === 0 && !getFirstMessageLoading.value) {
    if (chatStore.morePage) {
      if (messageParams.value.page) messageParams.value.page += 1;
      await getChatMessages(messageParams.value.page);
      const newScrollHeight = target.scrollHeight;
      target.scrollTop = newScrollHeight - oldScrollHeight;
    }
  }
};

onMounted(() => {
  getChatMessages(1);
});

watch(() => route.query, (newValue) => {
  if (newValue.chatId) {
    getChatMessages(1);
    messageParams.value = {
      perPage: 15,
      page: 1,
    };
  }
});

</script>

<template>
  <div class="flex flex-col">
    <ChatItemHeader
      v-if="$can(PermissionEnum.VIEW_CHAT_DETAILS)"
      :active-chat="chatFullInfo"
      :active-lead="activeLead"
      :loading="loading"
      @change-ai="emits('change-ai')"
      @update-lead="emits('update-lead')"
      @show-lead-info="emits('show-lead-info')"
      @back-chat-list="emits('back-chat-list')"
    />
    <div
      class="chat-item bg-white rounded-2xl px-4 flex flex-col scroll-hidden mt-4 dark:bg-gray-800"
    >
      <ChatItemContent
        ref="chatContainer"
        :loading="chatStore.getMessageLoading"
        :messages="chatStore.messages"
        :scroll-loading="getFirstMessageLoading"
        :scroll-to="scrollToBottom"
        class="flex-1 min-h-0"
        @scroll="getMessageOnScroll"
        @reply-message="clickReply"
      />
      <ChatItemContentForm
        v-if="$can(PermissionEnum.SEND_MESSAGE)"
        :reply-message="replyMessage"
        class="shrink-0"
        :contacts="contacts"
        @send-message="sendMessage"
        @change-channel="changeChannel"
        @clear-reply-message="replyMessage = undefined"
      />
    </div>
  </div>
</template>

<style lang="scss">
.chat-item {
  height: calc(100% - 94px);
}
</style>
