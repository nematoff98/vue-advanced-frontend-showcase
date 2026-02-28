<script lang="ts" setup>
import { Chat, ChatMessageType } from '@/services/chat';
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';

defineProps<{ chat: Chat }>();
</script>

<template>
  <div v-if="chat.lastMessage" class="flex items-center justify-between gap-1">
    <div class="flex items-center gap-1 flex-grow overflow-hidden">
      <span v-if="chat.lastMessage.fromMe" class="text-gray-700 font-medium">You:</span>
      <span class="text-gray-500 truncate">{{ chat.lastMessage.message }}</span>
      <!--      <div v-if="chat.call" class="flex items-center gap-1">
              <Icon :icon="Icons.PHONE_INCOMING" class="text-gray-400" />
              <span class="text-gray-500">{{ chat.call.type }}</span>
            </div>-->
      <div v-if="chat.lastMessage.type" class="flex items-center gap-1">
        <template v-if="chat.lastMessage.type === ChatMessageType.AUDIO">
          <Icon :icon="Icons.MICROPHONE" class="text-gray-400" />
          <span class="text-gray-500">Voice message</span>
        </template>
        <template v-else-if="chat.lastMessage.type === ChatMessageType.IMAGE">
          <Icon :icon="Icons.PAPERCLIP" class="text-gray-400" />
          <span class="text-gray-500">Image</span>
        </template>
      </div>
    </div>
    <!--    <Icon v-if="chat.isRead" :icon="Icons.CHECK_CHECK" class="flex-shrink-0" />-->
    <a-badge v-if="chat.unreadMessagesCount" :count="chat.unreadMessagesCount" color="blue" />
  </div>
</template>

<style lang="scss" scoped>

</style>
