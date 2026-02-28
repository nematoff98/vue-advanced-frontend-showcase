<script setup lang="ts">
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { ChatMessage, MessageSender, MessageStatus } from '@/services/chat';

interface Props {
  message: ChatMessage
}

defineProps<Props>();
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="text-primary">
      <Icon :icon="message.sender === MessageSender.CUSTOMER ? Icons.INCOMING_CALL : Icons.OUTGOING_CALL" size="18" />
    </div>
    <div>
      <p v-if="message.sender === MessageSender.CUSTOMER">Incoming Call</p>
      <p v-else>Outgoing Call</p>
      <span
        v-if="!message?.duration"
        class="flex items-center text-xxs gap-[2px]"
        :class="message.status === MessageStatus.ERROR || message.status === MessageStatus.MISSED ? 'text-red-400' : 'text-yellow-400'"
      >
        <Icon v-if="message.sender === MessageSender.CUSTOMER && (message.status === MessageStatus.MISSED || message.status === MessageStatus.ERROR)" :icon="Icons.ARROW_DOWN_RIGHT" />
        <Icon v-else-if="message.sender !== MessageSender.CUSTOMER" :icon="Icons.ARROW_UP_RIGHT" size="13" />
        <span class="capitalize">
          {{ message?.status }}
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
