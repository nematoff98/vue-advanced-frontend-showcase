<script lang="ts" setup>
import ChatItemContentMessageExtras from '@/components/pages/chats/ChatItemContentMessageExtras.vue';
import ChatItemContentReply from '@/components/pages/chats/ChatItemContentReply.vue';
import {
  ChatMessage, ChatMessageType, MessageChannel, MessageSender,
} from '@/services/chat';
import { formatPhoneNumber } from '@/utils/format-phone';
import { computed } from 'vue';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { useChatStore } from '@/stores/useChatStore';
import { getAvatarInitials } from '@/utils';

const chatStore = useChatStore();

interface ChatMessageContentTextProps {
  message: ChatMessage;
  withoutExtras?: boolean;
}

interface ChatMessageContentTextEmits {
  (e: 'scroll-to-message', id: number): void

  (e: 'reply-message', message: ChatMessage): void
}

const props = defineProps<ChatMessageContentTextProps>();
const emits = defineEmits<ChatMessageContentTextEmits>();

const scrollToMessage = () => {
  if (props.message.replyMessage?.id) emits('scroll-to-message', props.message?.replyMessage?.id);
};

const replyMessage = (message: ChatMessage) => {
  emits('reply-message', message);
};

const avatarText = computed(() => {
  if (props.message.sender === MessageSender.AUTO_MESSAGE) return '⚙️';
  if (props.message.sender === MessageSender.WORKER) return '👤';
  if (props.message.sender === MessageSender.AI) return 'AI';
  return '';
});

const leadFulName = computed(() => chatStore?.activeChat?.leadFullName);
</script>

<template>
  <div
    v-if="message?.sender"
    :class="[
      message.sender === MessageSender.CUSTOMER ? 'justify-start' : 'justify-end self-end',
      message.messageType === ChatMessageType.TEXT
        ? 'max-w-[600px] max-minMobile:max-w-[300px]'
        : 'w-[394px] max-minMobile:max-w-[300px] ',
    ]"
    class="flex mt-2"
  >
    <a-tooltip
      v-if="message.sender === MessageSender.CUSTOMER"
      class="w-10 h-10 flex text-green-600 items-center justify-center font-bold text-sm min-w-10 min-h-10 rounded-full bg-green-50 mr-2"
    >
      <template #title>{{ leadFulName }}</template>
      {{ getAvatarInitials(leadFulName) }}
    </a-tooltip>
    <div class="max-w-[85%]">
      <p
        v-if="message?.contact"
        :class="message.sender === MessageSender.CUSTOMER ? 'text-left' : 'text-right'"
        class="text-xs text-gray-400 mb-1"
      >
        <span
          v-if="message?.channel"
          class="uppercase"
        >
          {{ message.channel }}
        </span>
        -
        <span v-if="message.channel !== MessageChannel.EMAIL">
          {{ formatPhoneNumber(message.contact) }}
        </span>
        <span v-else>
          {{ message.contact }}
        </span>
      </p>
      <div
        :class="[
          message.sender === MessageSender.CUSTOMER ? 'bg-gray-50 dark:bg-white/5 rounded-r-xl' : 'bg-primary-50 rounded-l-xl dark:bg-primary-500/25',
          withoutExtras && !message?.replyMessage ? '' : 'px-3 py-2',
        ]"
        class="rounded-b-xl overflow-hidden"
      >
        <ChatItemContentReply
          v-if="message?.replyMessage"
          :message="message"
          @click="scrollToMessage"
        />
        <slot />
        <ChatItemContentMessageExtras
          v-if="!withoutExtras"
          :message="message"
          @reply="replyMessage"
        />
      </div>
    </div>
    <a-tooltip>
      <template #title v-if="message?.senderUser">{{ message.senderUser.name }}</template>
      <div
        v-if="message.sender === MessageSender.WORKER || message.sender === MessageSender.AI || message.sender === MessageSender.AUTO_MESSAGE"
        class="w-10 h-10 rounded-full bg-gray-100 ml-2 flex items-center justify-center text-l"
      >
        <Icon v-if="message.sender === MessageSender.AUTO_MESSAGE" :icon="Icons.ROBOT" size="24" />
        <span v-else class="font-bold text-primary-700">{{ avatarText }}</span>
      </div>
    </a-tooltip>
  </div>
</template>
