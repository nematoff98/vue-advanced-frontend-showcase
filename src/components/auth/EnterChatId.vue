<script setup lang="ts">
import BaseInput from '@/components/ui/BaseInput.vue';
import { ref } from 'vue';
import { LoginStage } from '@/services/auth';

interface QrCodeProps {
  loading?: boolean
}

interface QrCodeEmits {
  (e: 'continue', stage: LoginStage): void
}

const emits = defineEmits<QrCodeEmits>();
defineProps<QrCodeProps>();

const chatId = ref();

const next = () => {
  emits('continue', chatId.value);
};
</script>

<template>
  <div class="mb-1">
    <h3 class="text-l text-gray-700 my-4 text-center">Copy & paste chat ID sent by bot</h3>
    <BaseInput
      name="chat_id"
      label="Chat Id"
      placeholder="Your chat ID"
      v-model="chatId"
      remove-label
    />
  </div>
  <a-button
    type="primary"
    class="mt-3 h-10 w-full text-sm"
    :loading="loading"
    @click="next"
  >Continue
  </a-button>
</template>
