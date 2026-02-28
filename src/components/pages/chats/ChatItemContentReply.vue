<script lang="ts" setup>
import { ChatMessage } from '@/services/chat';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { ChatMessageMediaType } from '@/services/unknown-chats/unknown-chats.list';

interface ChatMessageContentTextProps {
  message: ChatMessage;
}

defineProps<ChatMessageContentTextProps>();
</script>

<template>
  <div
    :class="message.replyMessage && message?.replyMessage?.mediaType === ChatMessageMediaType.IMAGE ? 'w-[250px]' : ''"
    class="reply-message bg-white rounded-lg p-2 mb-1 max-w-full cursor-pointer"
  >
    <div class="pl-[6px] relative">
      <div class="absolute left-0 top-0 w-[2px] h-full bg-primary rounded-full" />
      <div class="flex items-center">
        <img
          v-if="message?.replyMessage && message?.replyMessage?.mediaType === ChatMessageMediaType.IMAGE"
          :src="message?.replyMessage?.fileUrl"
          alt=""
          class="w-[30px] h-6 rounded-[1.44px] mr-[6px]"
        >
        <div
          v-if="message?.replyMessage && message?.replyMessage?.mediaType === ChatMessageMediaType.PDF"
          class="w-6 h-6 rounded-[3px] bg-gray-50 flex items-center justify-center mr-[6px]"
        >
          <Icon :icon="Icons.PAPERCLIP" class="w-3 text-gray-300" />
        </div>
        <div>
          <h3
            v-if="message?.replyMessage?.sender"
            class="text-xxs text-primary font-bold"
          >
            {{ message.replyMessage.sender }}
          </h3>
          <p
            v-if="message?.replyMessage?.message"
            class="text-xxs text-gray font-normal truncate max-w-[235px]"
          >
            {{ message.replyMessage.message }}
          </p>
          <p
            v-else-if="message?.replyMessage && message?.replyMessage?.messageType"
            class="text-xxs text-gray font-normal"
          >
            {{ message.replyMessage.messageType }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
