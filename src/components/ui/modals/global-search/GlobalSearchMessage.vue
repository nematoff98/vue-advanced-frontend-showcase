<script lang="ts" setup>
import { GlobalSearchMessageData } from '@/services/global-search';
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { computed } from 'vue';
import dayjs from 'dayjs';
import { ChatMessageAttachmentType, MessageSender } from '@/services/chat';
import { Routes } from '@/router/router.links';

const { CHATS } = Routes;

const props = defineProps<{ message: GlobalSearchMessageData }>();

const date = computed(() => dayjs(props.message.createdAt).format('MMM DD, HH:mm'));
</script>

<template>
  <router-link
    :to="`${CHATS.path}?leadId=${props.message.leadId}&chatId=${props.message.chatId}`"
    class="flex items-start gap-2"
  >
    <div>
      <a-avatar :src="message.image" class="flex items-center justify-center bg-primary-100" size="large">
        <template #icon>
          <Icon :icon="Icons.USER_FILLED" :size="28" class="text-primary-400" />
        </template>
      </a-avatar>
    </div>
    <div class="overflow-hidden flex-grow">
      <div class="flex items-center gap-2 justify-between">
        <span class="font-bold text-gray-700 text-base">#{{ message.id }}</span>
        <span class="font-medium text-gray-400 text-xs">{{ date }}</span>
      </div>
      <div v-if="message" class="flex items-center justify-between gap-1">
        <div class="flex items-center gap-1 flex-grow overflow-hidden">
          <span v-if="message.sender === MessageSender.WORKER" class="text-gray-700 font-medium">You:</span>
          <span class="text-gray-500 truncate">{{ message.message }}</span>
          <!--      <div v-if="chat.call" class="flex items-center gap-1">
                  <Icon :icon="Icons.PHONE_INCOMING" class="text-gray-400" />
                  <span class="text-gray-500">{{ chat.call.type }}</span>
                </div>-->
          <div v-if="message.messageType" class="flex items-center gap-1">
            <template v-if="message.messageType === ChatMessageAttachmentType.AUDIO">
              <Icon :icon="Icons.MICROPHONE" class="text-gray-400" />
              <span class="text-gray-500">Voice message</span>
            </template>
            <template v-else-if="message.messageType === ChatMessageAttachmentType.IMAGE">
              <Icon :icon="Icons.PAPERCLIP" class="text-gray-400" />
              <span class="text-gray-500">Image</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>

</style>
