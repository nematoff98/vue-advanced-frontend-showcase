<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Attachments, ChatMessageAttachmentType } from '@/services/chat';

interface ChatMessageContentTextProps {
  file: Attachments;
  open: boolean
}

interface ChatMessageContentTextEmits {
  (e: 'close'): void
}

const props = defineProps<ChatMessageContentTextProps>();
const emits = defineEmits<ChatMessageContentTextEmits>();

const isModalOpen = ref(false);

watch(() => props.open, (newValue) => {
  isModalOpen.value = newValue;
});

watch(isModalOpen, (newValue) => {
  if (!newValue) {
    emits('close');
  }
});
</script>

<template>
  <a-modal
    v-model:open="isModalOpen"
    :footer="null"
    title="File Preview"
    width="40%"
  >
    <iframe
      v-if="file.fileType === ChatMessageAttachmentType.DOCS || file.fileType === ChatMessageAttachmentType.PDF"
      :src="file.fileUrl"
      allowfullscreen
      class="modal-iframe"
      frameborder="0"
      title="Document Preview"
    />

    <!-- Agar Video bo‘lsa -->
    <video v-else-if="file.fileType === ChatMessageAttachmentType.VIDEO" class="modal-video" controls>
      <source :src="file.fileUrl" type="video/mp4" />
      <track kind="captions" label="English" src="path/to/captions.vtt" srclang="en" />
    </video>
  </a-modal>
</template>

<style lang="scss" scoped>
.modal-iframe {
  width: 100%;
  height: 70vh;
  border: none;
}

.modal-video {
  width: 100%;
  max-height: 500px;
  border-radius: 8px;
}
</style>
