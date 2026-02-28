<script setup lang="ts">
import ChatItemContentUploadModal from '@/components/pages/chats/ChatItemContentUploadModal.vue';
import Icon from '@/components/icon/Icon.vue';
import { TempMessage } from '@/services/chat/chat.interface';
import { Icons } from '@/components/icon/helpers';
import { ref } from 'vue';

interface ChatItemContentUploadModalEmits {
  (e: 'send-file', fileMessage: TempMessage): void;
}

interface Props {
  isUnknown?: boolean;
}

defineProps<Props>();
const emits = defineEmits<ChatItemContentUploadModalEmits>();

const isModalOpen = ref(false);
const uploadedFiles = ref<FileList>(new DataTransfer().files);

const upload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const { files } = target;
  uploadedFiles.value = files;
  isModalOpen.value = true;
};

const handleFileUpload = (fileData: TempMessage) => {
  emits('send-file', fileData);
};
</script>

<template>
  <label
    class="w-8 h-8 max-minMobile:h-7 max-minMobile:w-7 rounded-lg bg-gray-50 flex items-center justify-center mr-2 cursor-pointer"
  >
    <Icon :icon="Icons.PAPERCLIP" class="text-gray-600" />
    <input type="file" class="hidden" @input="upload" accept=".jpeg, .jpg, .png, .mp4, .ogg, .mp3, .pdf, .webm, .opus">
  </label>
  <ChatItemContentUploadModal
    :visible="isModalOpen"
    :files="uploadedFiles"
    :is-unknown="isUnknown"
    @close="isModalOpen = false"
    @file-upload="handleFileUpload"
  />
</template>

<style scoped lang="scss">

</style>
