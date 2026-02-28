<script lang="ts" setup>
import ChatItemContentFileOpen from '@/components/pages/chats/ChatItemContentFileOpen.vue';
import Icon from '@/components/icon/Icon.vue';
import {
  Attachments, ChatMessage, ChatMessageAttachmentType, MessageSender,
} from '@/services/chat';
import { Icons } from '@/components/icon/helpers';
import { ref } from 'vue';
import { formatFileSize } from '@/utils';

interface ChatMessageContentTextProps {
  attachment: Attachments;
  message: ChatMessage;
}

defineProps<ChatMessageContentTextProps>();

const openFile = ref(false);

const downloadFile = (file: string) => {
  const a = document.createElement('a');
  a.href = file;
  a.download = 'sample.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const openMessage = () => {
  openFile.value = true;
};
</script>

<template>
  <div
    :class="[
      message.sender === MessageSender.CUSTOMER ? 'bg-gray-50 rounded-b-xl rounded-r-xl' : 'bg-primary-50 rounded-b-xl rounded-l-xl',
      message.message ? '' : 'px-3 py-2',
    ]"
  >
    <div class="bg-white p-2 flex justify-between rounded-lg">
      <div class="flex">
        <button
          class="bg-gray-50 w-8 h-8 flex items-center justify-center rounded"
          type="button"
          @click="openMessage"
        >
          <Icon
            v-if="attachment.fileType === ChatMessageAttachmentType.PDF || attachment.fileType === ChatMessageAttachmentType.DOCS"
            :class="message.sender === MessageSender.CUSTOMER ? 'text-gray-300' : 'text-primary-300'"
            :icon="Icons.PAPERCLIP"
          />
          <Icon
            v-if="attachment.fileType === ChatMessageAttachmentType.VIDEO"
            :class="message.sender === MessageSender.CUSTOMER ? 'text-gray-300' : 'text-primary-300'"
            :icon="Icons.VIDEO"
          />
        </button>
        <div class="ml-2">
          <p
            v-if="attachment?.fileUrl && attachment?.fileName"
            :class="message.sender === MessageSender.CUSTOMER ? 'text-gray-700' : 'text-primary-600'"
            class="text-xs"
          >{{ attachment.fileName }}</p>
          <p
            v-if="attachment?.fileSize"
            class="text-xxs text-gray-400 mt-1"
          >{{ formatFileSize(attachment.fileSize) }}</p>
        </div>
      </div>
      <button class="mr-2" type="button">
        <Icon
          v-if="attachment?.fileUrl"
          :class="message.sender === MessageSender.CUSTOMER ? 'text-gray-400' : 'text-primary-400'"
          :icon="Icons.DOWNLOAD"
          class="text-gray-400"
          size="16"
          @click="downloadFile(attachment.fileUrl)"
        />
      </button>
    </div>
    <ChatItemContentFileOpen
      :file="attachment"
      :open="openFile"
      @close="openFile = false"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
