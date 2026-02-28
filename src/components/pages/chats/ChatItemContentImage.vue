<script lang="ts" setup>
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { Attachments, ChatMessage, MessageSender } from '@/services/chat';

interface ChatMessageContentTextProps {
  message: ChatMessage;
  attachment: Attachments;
}

defineProps<ChatMessageContentTextProps>();
</script>

<template>
  <div class="relative">
    <div class="max-w-full w-[394px] max-h-[280px] min-h-[200px] bg-gray-100 rounded-xl overflow-hidden">
      <a-image
        v-if="attachment?.fileUrl"
        :src="attachment.fileUrl"
        alt=""
        class="rounded-xl w-full h-full max-w-full min-h-[200px] object-cover"
      />
    </div>
    <div
      v-if="message.sender === MessageSender.CUSTOMER && !message.message"
      class="absolute bottom-2 right-2 flex items-center"
    >
      <button
        v-if="message.sender === MessageSender.CUSTOMER"
        class="text-gray-500 text-xxs flex items-center rounded-3xl bg-white px-[6px] mr-1 py-1"
        type="button"
      >
        <Icon :icon="Icons.ARROW_LEFT_TYPE" class="mr-1" size="9" />
        Reply
      </button>
      <p
        v-if="message.sender === MessageSender.CUSTOMER"
        class="text-gray-500 text-xxs flex items-center rounded-3xl bg-white px-[6px] py-1"
        type="button"
      >
        11:26
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.ant-image {
  width: 100%;
}
</style>
