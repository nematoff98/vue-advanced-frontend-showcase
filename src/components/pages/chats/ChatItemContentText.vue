<script lang="ts" setup>
import { ChatMessage } from '@/services/chat';

interface ChatMessageContentTextProps {
  message: ChatMessage;
}

defineProps<ChatMessageContentTextProps>();
</script>

<template>
  <p
    class="text-sm text-gray-700"
    :class="message.attachments?.length ? 'mt-2' : ''"
  >
    {{ message.message }}
  </p>
</template>
