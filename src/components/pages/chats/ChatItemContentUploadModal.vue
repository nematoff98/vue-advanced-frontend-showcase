<script lang="ts" setup>
import Icon from '@/components/icon/Icon.vue';
import {
  Attachments, ChatMessageAttachmentType, MessageSender, TempMessage,
} from '@/services/chat';
import { Icons } from '@/components/icon/helpers';
import { message } from 'ant-design-vue';
import { computed, ref, watch } from 'vue';
import ChatItemContentAudio from '@/components/pages/chats/ChatItemContentAudio.vue';
import { colors } from '@/utils';
import { AVAILABLE_FILE_TYPES } from '@/services/general';

interface ChatItemContentUploadModalProps {
  visible: boolean,
  files?: FileList,
  isUnknown?: boolean
}

interface ChatItemContentUploadModalEmits {
  (e: 'close'): void,

  (e: 'file-upload', uploadedMessage: TempMessage): void
}

const props = defineProps<ChatItemContentUploadModalProps>();

const emits = defineEmits<ChatItemContentUploadModalEmits>();

const MAX_FILE_SIZE = computed(() => (
  props.isUnknown ? 10 * 1024 * 1024 : 1024 * 1024 // 10MB when isUnknown, else 1MB
));
const maxFileSizeMB = computed(() => (props.isUnknown ? 10 : 1));

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const inputMessage = ref('');
const openModal = ref(false);
const fileList = ref<Attachments[]>([]);

watch(() => props.visible, (newValue) => {
  if (newValue) {
    openModal.value = true;

    fileList.value = [];
    let errorMessage = false;

    Array.from(props.files ?? []).forEach((file) => {
      if (file.size > MAX_FILE_SIZE.value) {
        errorMessage = true;
        return;
      }

      let detectedType: ChatMessageAttachmentType = ChatMessageAttachmentType.UNKNOWN;
      Object.keys(AVAILABLE_FILE_TYPES).forEach((key) => {
        const upperKey = key.toUpperCase();
        if (upperKey in ChatMessageAttachmentType) {
          if (AVAILABLE_FILE_TYPES[key as keyof typeof AVAILABLE_FILE_TYPES].includes(file.type)) {
            detectedType = ChatMessageAttachmentType[upperKey as keyof typeof ChatMessageAttachmentType];
          }
        }
      });

      fileList.value.push({
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: +(file.size / 1024).toFixed(2),
        fileType: detectedType,
      });
    });
    if (errorMessage) {
      message.error(`The file size should not be larger than ${maxFileSizeMB.value}MB!`);
      emits('close');
    }
  }
  if (!newValue) openModal.value = false;
});

const closeModal = () => {
  emits('close');
};

const resizeTextarea = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = '48px'; // Minimal height
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`; // Max: 5 rows (5 * 24px = 120px)
  }
};

const sendFile = () => {
  const fileMessage = {
    message: inputMessage.value || '',
    attachments: fileList.value,
    files: props.files,
  } as TempMessage;

  emits('file-upload', fileMessage);
  closeModal();
};
</script>

<template>
  <a-modal
    v-model:open="openModal"
    :footer="null"
    centered
    title="Send File"
    :mask-closable="false"
    closable
    width="550px"
    @cancel="closeModal"
  >
    <template v-if="fileList?.length">
      <div
        v-for="(file, i) in fileList"
        :key="`file-${i}`"
        class="flex items-center justify-center rounded-xl overflow-hidden mb-3"
      >
        <ChatItemContentAudio
          v-if="file.fileType === ChatMessageAttachmentType.AUDIO"
          :audio-src="file.fileUrl"
          :fill-color="colors.primary[500]"
          :sender="MessageSender.WORKER"
          full-width
        />

        <img
          v-if="file.fileType === ChatMessageAttachmentType.IMAGE"
          :src="file.fileUrl"
          alt="Image description"
          class="preview-content w-full h-full max-h-[350px] object-cover"
        />

        <video
          v-else-if="file.fileType === ChatMessageAttachmentType.VIDEO"
          class="preview-content w-full h-full"
          controls
        >
          <source :src="file.fileUrl" type="video/mp4" />
          <track :src="file.fileUrl" kind="captions" label="English" srclang="en">
        </video>

        <iframe
          v-else-if="file.fileType === ChatMessageAttachmentType.PDF"
          :src="file.fileUrl"
          class="preview-content w-full h-full"
          title="File preview" />
      </div>
    </template>

    <form
      class="upload-modal-form relative"
      @submit.prevent="sendFile"
    >
      <div
        class="relative flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden"
      >
        <!-- Prefix Button (AI) -->
        <a-button
          v-if="!isUnknown"
          class="absolute left-3 bottom-2 flex items-center justify-center bg-primary-50 hover:bg-primary-100 w-8 h-8"
          type="ghost"
        >
          <template #icon>
            <Icon :icon="Icons.AI_STARS" class="text-primary-600" />
          </template>
        </a-button>

        <!-- Message -->
        <label for="messageInput" />
        <textarea
          id="messageInput"
          ref="textareaRef"
          v-model="inputMessage"
          class="resize-none w-full h-12 max-h-[120px] py-3 border-none outline-none scroll-hidden"
          :class="isUnknown ? 'pl-3 pr-[52px]' : 'px-[52px]'"
          placeholder="Type a message..."
          rows="2"
          @input="resizeTextarea"
        />

        <!-- Suffix Button (Send) -->
        <a-button
          class="absolute right-3 bottom-2 flex items-center justify-center w-8 h-8"
          html-type="submit"
          type="primary"
        >
          <template #icon>
            <Icon :icon="Icons.SEND" />
          </template>
        </a-button>
      </div>
    </form>
  </a-modal>
</template>

<style>
.preview-content {
  max-height: 430px;
}
</style>
