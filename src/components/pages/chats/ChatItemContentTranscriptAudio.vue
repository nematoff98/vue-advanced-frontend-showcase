<script lang="ts" setup>
import { AudioMessageTranscript, ChatServiceInstance, MessageSender } from '@/services/chat';
import { ref, watch } from 'vue';

interface ChatItemContentTranscriptAudioProps {
  open: boolean;
  messageId?: number
}

interface ChatItemContentTranscriptAudioEmits {
  (e: 'update:open', value: boolean): void
}

const props = defineProps<ChatItemContentTranscriptAudioProps>();
defineEmits<ChatItemContentTranscriptAudioEmits>();

const messages = ref<AudioMessageTranscript[]>([]);
const loading = ref(false);

const getAudioTranscript = async () => {
  if (!props.messageId) return;
  loading.value = true;
  try {
    messages.value = await ChatServiceInstance.getAudioMessageTranscript(props.messageId);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

watch(() => props.open, (newValue) => {
  if (newValue && props.messageId) {
    getAudioTranscript();
  }
});
</script>

<template>
  <a-modal
    :open="open"
    centered
    title="Call record text"
    width="550px"
    @cancel="$emit('update:open', false)"
  >
    <a-spin
      :spinning="loading"
    >
      <div class="max-h-[500px] overflow-y-auto min-h-[500px]">
        <div
          v-if="messages?.length"
          class="flex flex-col mt-3 gap-4"
        >
          <div
            v-for="(message, i) in messages"
            :key="`message-${i}`"
            :class="message.sender !== MessageSender.CUSTOMER ? 'self-end' : ''
            "
            class="flex max-w-[80%]"
          >
            <div
              v-if="message.sender === MessageSender.CUSTOMER"
              class="w-10 h-10 min-w-10 min-h-10 rounded-full bg-gray-200 mr-2 max-w-[70%]"
            >
              <img alt="" src="">
            </div>
            <div
              :class="message.sender === MessageSender.CUSTOMER ? 'bg-gray-50 rounded-b-xl rounded-tr-xl' : 'bg-primary-50 rounded-b-xl rounded-tl-xl'"
              class="px-3 py-2"
            >
              {{ message.message }}
            </div>
            <div
              v-if="message.sender !== MessageSender.CUSTOMER"
              class="w-10 h-10 min-w-10 min-h-10 rounded-full bg-gray-200 ml-2"
            >
              <img alt="" src="">
            </div>
          </div>
        </div>
        <div v-else-if="!loading && !messages?.length" class="text-center mt-16">No Data</div>
      </div>
    </a-spin>
    <template #footer>
      <div class="px-5 mt-3 pt-3 border-t border-gray-100">
        <a-button
          class="border-none bg-gray-50"
          @click="$emit('update:open', false)"
        >Close
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped>

</style>
