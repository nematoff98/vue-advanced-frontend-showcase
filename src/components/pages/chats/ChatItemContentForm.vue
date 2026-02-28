<script lang="ts" setup>
import ChatItemContentFormMessageTempModal from '@/components/pages/chats/ChatItemContentFormMessageTempModal.vue';
import ChatItemContentFormAiGenerate from '@/components/pages/chats/ChatItemContentFormAiGenerate.vue';
import ChatItemContentFormTemplate from '@/components/pages/chats/ChatItemContentFormTemplate.vue';
import ChatItemContentFormContact from '@/components/pages/chats/ChatItemContentFormContact.vue';
import ChatItemContentFormUpload from '@/components/pages/chats/ChatItemContentFormUpload.vue';
import { useErrorNotification } from '@/composables/useErrorNotification';
import {
  ChatMessage, ChatUserContact, TempMessage,
} from '@/services/chat/chat.interface';
import { ChatServiceInstance, MessageChannel } from '@/services/chat';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { useChatStore } from '@/stores/useChatStore';

const route = useRoute();
const useErrorNotify = useErrorNotification();
const chatStore = useChatStore();
const $can = useCan();

interface MessageFormEmits {
  (e: 'send-message', message: TempMessage, channel: MessageChannel): void

  (e: 'change-channel', channel: MessageChannel): void

  (e: 'clear-reply-message'): void
}

interface MessageFormProps {
  replyMessage?: ChatMessage
  contacts?: ChatUserContact[]
  isUnknown?: boolean
}

const emits = defineEmits<MessageFormEmits>();
const props = defineProps<MessageFormProps>();

const message = ref('');
const uploadedFile = ref<TempMessage>();
const channelValue = ref<MessageChannel>();
const showMessageTemplateModal = ref(false);
const aIGenerateLoading = ref(false);
const templateChannel = ref<MessageChannel>();
const subject = ref<string>();
const messageTemplateId = ref<number>();

// refs
const textareaRef = ref();

function getDefaultChannel(): MessageChannel | undefined {
  const messages = chatStore.messages ?? [];
  // Oxirgidan boshla, birinchi call bo'lmagan message ni topamiz
  const lastNonCall = [...messages].reverse().find(
    (m: ChatMessage) => m.channel !== MessageChannel.CALL,
  );
  if (lastNonCall) {
    return lastNonCall.channel;
  }
  // Message yo'q yoki hammasi call bo'lsa — contacts dan isDefault: true ni olamiz
  const contacts = props.contacts ?? [];
  const defaultContact = contacts.find((c) => c.isDefault);
  if (defaultContact) {
    return defaultContact.channel;
  }
  if (contacts.length) {
    return contacts[0].channel;
  }
  return undefined;
}

watch(
  () => [chatStore.messages, props.contacts],
  () => {
    channelValue.value = getDefaultChannel();
  },
  { deep: true },
);

const sendMessage = () => {
  if (!route.query?.chatId) return;
  if (!templateChannel.value && !channelValue.value) return;
  emits('send-message', {
    message: uploadedFile.value?.message || message.value,
    chat_id: +route.query.chatId,
    attachments: uploadedFile.value?.attachments,
    files: uploadedFile.value?.files,
    subject: subject.value,
    messageTemplateId: messageTemplateId.value,
  } as TempMessage, (templateChannel.value ?? channelValue.value)!);
  templateChannel.value = undefined;
  uploadedFile.value = undefined;
  messageTemplateId.value = undefined;
  subject.value = undefined;
  message.value = '';
};

const sendTextMessage = () => {
  if (!message.value) return;
  sendMessage();
};

const sendUploadedFile = (fileMessage: TempMessage) => {
  uploadedFile.value = fileMessage;
  sendMessage();
};

const sendTemplateMessage = ({
  value,
  channel,
  subjectValue,
  templateId,
}: {
  value: string,
  channel: MessageChannel,
  subjectValue?: string
  templateId?: number
}) => {
  message.value = value;
  templateChannel.value = channel;
  subject.value = subjectValue;
  messageTemplateId.value = templateId;
  sendMessage();
};

const changeChannel = (channel?: MessageChannel) => {
  if (!channel) return;
  channelValue.value = channel;
  emits('change-channel', channel);
};

const resizeTextarea = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = '48px';
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`;
  }
};

const generateAIMessage = async () => {
  aIGenerateLoading.value = true;
  const { chatId } = route.query;
  if (!chatId) return;
  try {
    const data = await ChatServiceInstance.getAIMessage(+chatId);
    message.value = data.message;
    setTimeout(() => {
      resizeTextarea();
    }, 300);
  } catch (err) {
    useErrorNotify.showErrorNotification(err);
  } finally {
    aIGenerateLoading.value = false;
  }
};

onMounted(() => {
  channelValue.value = getDefaultChannel();
  const customTextarea = document.getElementById('message');
  if (customTextarea) {
    customTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendTextMessage();
      }
    });
  }
});
</script>

<template>
  <form
    @submit.prevent="sendTextMessage"
    class="upload-modal-form relative pb-3"
  >
    <div class="border border-gray-200 bg-white rounded-xl">
      <div v-if="replyMessage" class="p-2 flex items-center justify-between">
        <div class="flex items-center">
          <Icon :icon="Icons.ARROW_LEFT_TYPE" class="text-primary mr-2" />
          <div class="pl-[6px] relative flex items-center">
            <div class="absolute w-[2px] h-full bg-primary rounded-full left-0 top-0" />
            <img
              v-if="replyMessage?.attachments?.length"
              :src="replyMessage.attachments[0].fileUrl"
              alt=""
              class="w-[30px] h-6 object-cover rounded-[4px] mr-[6px]"
            >
            <div>
              <p v-if="replyMessage?.contact" class="text-xxs font-bold text-primary">{{ replyMessage.contact }}</p>
              <p
                v-if="replyMessage?.message"
                class="text-xxs text-gray-500 max-lines-1 pr-10"
              >{{ replyMessage.message }}</p>
            </div>
          </div>
        </div>
        <button
          class="w-6 h-6 min-w-6 min-h-6 bg-gray-50 rounded-[6px] flex items-center justify-center text-gray-700"
          type="button"
          @click="$emit('clear-reply-message')"
        >
          <Icon :icon="Icons.X" class="text-gray-700" size="14" />
        </button>
      </div>
      <div
        class="relative flex items-center overflow-hidden px-2"
      >
        <div />
        <!-- Prefix Button (AI) -->
        <div v-if="!isUnknown" class="flex items-center">
          <ChatItemContentFormTemplate
            v-if="$can(PermissionEnum.VIEW_CHAT_DETAILS)"
            @click="showMessageTemplateModal = true"
          />
          <ChatItemContentFormAiGenerate
            v-if="$can(PermissionEnum.NEXT_AI_MESSAGE)"
            @generate-ai-message="generateAIMessage"
            :loading="aIGenerateLoading"
          />
        </div>

        <label for="message" />
        <!-- Message -->
        <textarea
          id="message"
          ref="textareaRef"
          v-model="message"
          class="resize-none w-full h-12 text-[12px] min-minMobile:text-[14px] max-h-[120px] py-3 border-none outline-none scroll-hidden"
          :class="{ 'pl-2': isUnknown }"
          placeholder="Your message"
          rows="2"
          @input="resizeTextarea"
        />

        <!-- Suffix Button (Send) -->
        <div class="flex items-center">
          <ChatItemContentFormUpload @send-file="sendUploadedFile" :is-unknown="isUnknown" />
          <ChatItemContentFormContact
            @update:channel-value="changeChannel"
            :channel-value="channelValue"
            :contacts="contacts"
          />
          <a-button
            class="flex items-center justify-center max-minMobile:h-7 max-minMobile:max-w-7"
            html-type="submit"
            type="primary"
          >
            <template #icon>
              <Icon :icon="Icons.SEND" />
            </template>
          </a-button>
        </div>
      </div>
    </div>
    <ChatItemContentFormMessageTempModal
      :open="showMessageTemplateModal"
      @update:open="event => showMessageTemplateModal = event"
      @send-template="sendTemplateMessage"
    />
  </form>
</template>

<style lang="scss">
@import "@/assets/styles/var";

.message-form {
  .ant-input-affix-wrapper {
    .ant-select-selector {
      border: transparent;
      background: var(--color-gray-50);
    }

    padding-left: 8px;
    padding-right: 8px;

    .ant-select-selection-item {
      padding-inline-end: 4px !important;
    }

    .ant-select-arrow {
      inset-inline-end: 8px;
    }

    .ant-select-selector {
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
  }
}
</style>
