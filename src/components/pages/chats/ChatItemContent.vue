<script lang="ts" setup>
import ChatItemContentTranscriptAudio from '@/components/pages/chats/ChatItemContentTranscriptAudio.vue';
import ChatsItemContentSkeleton from '@/components/pages/chats/ChatsItemContentSkeleton.vue';
import ChatItemContentAuthor from '@/components/pages/chats/ChatItemContentAuthor.vue';
import ChatItemContentImage from '@/components/pages/chats/ChatItemContentImage.vue';
import ChatItemContentAudio from '@/components/pages/chats/ChatItemContentAudio.vue';
import ChatItemContentFile from '@/components/pages/chats/ChatItemContentFile.vue';
import ChatItemContentText from '@/components/pages/chats/ChatItemContentText.vue';
import {
  ChatMessage, ChatMessageAttachmentType, ChatMessageType, MessageChannel, MessageSender,
} from '@/services/chat';
import { useScrollToMessage } from '@/composables/useScrollToMessage';
import { colors } from '@/utils';
import {
  nextTick, onMounted, ref, watch,
} from 'vue';
import ChatItemContentCall from '@/components/pages/chats/ChatItemContentCall.vue';
import ChatItemContentEmailTemplate from '@/components/pages/chats/ChatItemContentEmailTemplate.vue';
import { useChatStore } from '@/stores/useChatStore';

const { scrollToMessage } = useScrollToMessage();
const chatStore = useChatStore();

interface ChatItemContentProps {
  messages: ChatMessage[];
  scrollTo: boolean
  loading: boolean
  scrollLoading: boolean
}

interface ChatItemContentEmits {
  (e: 'reply-message', message: ChatMessage): void

  (e: 'scroll', event: Event, blockRef: HTMLDivElement): void
}

const props = defineProps<ChatItemContentProps>();
const emits = defineEmits<ChatItemContentEmits>();

const chatContainer = ref();

const audioPlayer = ref();

const transcriptModalOpen = ref(false);
const messageIdForTranscriptModal = ref<number>();

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});

watch(
  () => props.scrollTo,
  async () => {
    if (!props.scrollTo) return;
    await nextTick();
    scrollToBottom();
  },
);

const isFile = (mediaType: ChatMessageAttachmentType) => (
  mediaType === ChatMessageAttachmentType.CSV
  || mediaType === ChatMessageAttachmentType.DOCS
  || mediaType === ChatMessageAttachmentType.PDF
  || mediaType === ChatMessageAttachmentType.VIDEO
);

const replyMessage = (message: ChatMessage) => {
  emits('reply-message', message);
};

const scrollTop = (event: Event) => {
  emits('scroll', event, chatContainer.value);
};

const showTranscript = (id: number) => {
  messageIdForTranscriptModal.value = id;
  transcriptModalOpen.value = true;
};

watch(() => chatStore.messages.length, () => {
  const container = chatContainer.value as HTMLDivElement;

  if (!container) return;
  const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

  if (!chatContainer.value) return;
  if (isAtBottom) {
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  }
});
</script>

<template>
  <ChatsItemContentSkeleton v-if="loading" />
  <div
    v-else
    ref="chatContainer"
    class="flex-1 flex flex-col min-h-0 overflow-auto pb-4"
    @scroll="scrollTop"
  >
    <div>
      <BaseTransition>
        <div v-if="scrollLoading" class="flex justify-center py-3 text-gray-600">
          Loading...
        </div>
      </BaseTransition>
      <div
        v-for="(message, i) in messages"
        :key="`message-${i}`"
        class="flex-1 flex flex-col justify-end"
      >
        <div
          v-if="message.showLabel"
          class="text-center my-3"
        >
          <span class="">
            {{ message.formattedDateLabel }}
          </span>
        </div>
        <ChatItemContentAuthor
          :data-message-id="message.id"
          :message="message"
          :without-extras="message.messageType === ChatMessageType.FILE && !message.message"
          @scroll-to-message="scrollToMessage"
          @reply-message="replyMessage"
        >
          <div v-for="(file, i) in message.attachments" :key="`attach-${i}`">
            <ChatItemContentImage
              v-show="file.fileType === ChatMessageAttachmentType.IMAGE"
              :attachment="file"
              :message="message"
            />
            <ChatItemContentAudio
              v-if="file.fileType === ChatMessageAttachmentType.AUDIO"
              ref="audioPlayer"
              :audio-src="file.fileUrl"
              :fill-color="message.sender === MessageSender.CUSTOMER ? colors.gray[400] : colors.primary[500]"
              :message="message"
              @open-transcript="showTranscript"
            />
            <ChatItemContentFile
              v-show="file?.fileType && isFile(file.fileType)"
              :attachment="file"
              :message="message"
            />
          </div>
          <ChatItemContentEmailTemplate
            :message="message.message"
            v-if="
              (
                message.sender === MessageSender.WORKER
                || message.sender === MessageSender.AI
                || message.sender === MessageSender.AUTO_MESSAGE)
                && message.channel === MessageChannel.EMAIL
                && message?.message
            "
          />
          <ChatItemContentCall
            v-if="message.messageType === ChatMessageType.CALL && !message.attachments?.length"
            :message="message"
          />
          <ChatItemContentText
            v-show="
              (message.message && message.sender === MessageSender.CUSTOMER)
                || (message.message && message.channel !== MessageChannel.EMAIL && message.sender !== MessageSender.CUSTOMER)"
            :message="message"
          />
        </ChatItemContentAuthor>
      </div>
    </div>
    <ChatItemContentTranscriptAudio
      :message-id="messageIdForTranscriptModal"
      :open="transcriptModalOpen"
      @update:open="transcriptModalOpen = false"
    />
  </div>
</template>

<style lang="scss">
.ant-skeleton-paragraph {
  li {
    height: 36px !important;
  }
}
</style>
