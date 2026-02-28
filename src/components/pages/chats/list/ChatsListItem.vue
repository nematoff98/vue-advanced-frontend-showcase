<script lang="ts" setup>
import { leadStatusColorMap, leadStatusTextMap } from '@/services/lead';
import ChatListMessageInfo from '@/components/pages/chats/list/ChatListMessageInfo.vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Chat } from '@/services/chat';
import { formatPhoneNumber } from '@/utils/format-phone';
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';

interface Props {
  chat: Chat
}

const props = defineProps<Props>();

const router = useRouter();
const route = useRoute();

const activeChatId = computed(() => {
  let result = false;
  if (route.query?.chatId && props.chat?.id && +route.query.chatId === props.chat.id) result = true;
  return result;
});

const navigate = (query: { leadId: number, chatId: number }) => {
  router.push({ query });
};
</script>

<template>
  <article
    :class="{ active: activeChatId }"
    class="flex gap-2 py-4 pl-2 pr-3 rounded-[4px] border-l-4 border-l-transparent [&.active]:border-l-primary-600 [&.active]:bg-primary-50 cursor-pointer border-b border-gray-100 dark:border-b-white/5 dark:[&.active]:bg-primary-500/25"
    @click="navigate({ leadId: chat.leadId, chatId: chat.id })">
    <div class="flex-shrink-0">
      <a-avatar size="large" class="flex items-center justify-center">
        <Icon :icon="Icons.USER_FILLED" size="28" />
      </a-avatar>
    </div>
    <div class="flex-grow overflow-hidden flex flex-col gap-.5">
      <div class="flex items-center justify-between gap-1 mb-0.5">
        <div class="flex items-center gap-1">
          <span class="text-gray-700 font-bold text-base">#{{ chat.leadNumber }}</span>
          <!--                  <Icon v-if="chat.pinned" :icon="Icons.PIN" class="text-gray-400" />-->
        </div>
        <a-tag
          :color="leadStatusColorMap[chat.leadStatus].bgColor"
          :style="`color: ${leadStatusColorMap[chat.leadStatus].color}`"
        >{{ leadStatusTextMap[chat.leadStatus] }}
        </a-tag>
      </div>
      <div class="flex items-center justify-between gap-1 mb-1">
        <span v-if="chat?.phone" class="font-medium text-sm text-gray-500">
          {{ formatPhoneNumber(chat.leadPhone) }}
        </span>
        <span class="text-gray-400 font-medium text-sm">{{ chat.lastMessage?.date }}</span>
      </div>
      <ChatListMessageInfo :chat="chat" />
    </div>
  </article>
</template>

<style lang="scss" scoped>

</style>
