<script lang="ts" setup>
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { ChatMessage, MessageSender, MessageStatus } from '@/services/chat';
import { extractTime } from '@/utils';

interface ChatMessageContentTextProps {
  message: ChatMessage;
}

interface ChatMessageContentTextEmits {
  (e: 'reply', message: ChatMessage): void;
}

defineProps<ChatMessageContentTextProps>();
defineEmits<ChatMessageContentTextEmits>();
</script>

<template>
  <div
    class="flex items-center justify-end mt-1"
  >
    <!--    <button-->
    <!--      v-if="message.sender === MessageSender.CUSTOMER"-->
    <!--      class="text-gray-500 text-xxs flex items-center rounded-3xl bg-gray-100 px-[6px] mr-1 py-1 hover:bg-gray-200"-->
    <!--      type="button"-->
    <!--      @click="$emit('reply', message)"-->
    <!--    >-->
    <!--      <Icon-->
    <!--        :icon="Icons.ARROW_LEFT_TYPE"-->
    <!--        class="mr-1"-->
    <!--        size="9"-->
    <!--      />-->
    <!--      Reply-->
    <!--    </button>-->
    <p v-if="message?.createdAt" class="text-gray-400">{{ extractTime(message.createdAt) }}</p>
    <a-tooltip :color="message?.status === MessageStatus.ERROR ? 'red' : 'gray'">
      <template #title>{{ message?.status }}</template>
      <Icon
        v-if="(
          message.sender === MessageSender.WORKER
          || message.sender === MessageSender.AUTO_MESSAGE
          || message.sender === MessageSender.AI
        ) && message?.status !== MessageStatus.ERROR && message?.status !== MessageStatus.WAITING"
        :icon="Icons.CHECK_ALL"
        class="text-gray-400 ml-1"
      />
      <span v-if="message?.status === MessageStatus.ERROR" class="text-red-500 ml-1">!</span>
      <Icon v-if="message.status === MessageStatus.WAITING" :icon="Icons.CLOCK" class="text-gray-400 ml-1" />
    </a-tooltip>
  </div>
</template>
