<script setup lang="ts">
import ChatItemHeaderLeadInfo from '@/components/pages/chats/ChatItemHeaderLeadInfo.vue';
import ChatItemHeaderControl from '@/components/pages/chats/ChatItemHeaderControl.vue';
import ChatItemHeaderCall from '@/components/pages/chats/ChatItemHeaderCall.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import { ChatFullInfo } from '@/services/chat';
import { FullLeadInfo } from '@/services/lead';
import { ref } from 'vue';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';

const $can = useCan();

interface ChatItemProps {
  activeChat?: ChatFullInfo
  activeLead?: FullLeadInfo
  loading?: boolean
}

interface Emits {
  (e: 'change-ai'): void
  (e: 'update-lead'): void
  (e: 'show-lead-info'): void
  (e: 'back-chat-list'): void
}

defineProps<ChatItemProps>();
const emits = defineEmits<Emits>();

const chatMessageRef = ref();
</script>

<template>
  <a-skeleton-button
    v-if="loading"
    class="chat-header-skeleton"
  />
  <div v-else ref="chatMessageRef">
    <BaseCard class="py-[11px] px-3 flex items-center">
      <ChatItemHeaderLeadInfo
        :active-lead="activeLead"
        @update-lead="emits('update-lead')"
        @back-chat-list="emits('back-chat-list')"
      />
      <ChatItemHeaderCall
        v-if="$can(PermissionEnum.CALL_ACTION)"
        :active-chat="activeChat"
        :active-lead="activeLead"
      />
      <ChatItemHeaderControl
        :active-chat="activeChat"
        @change-ai="emits('change-ai')"
        @show-lead-info="emits('show-lead-info')"
      />
    </BaseCard>
  </div>
</template>

<style lang="scss">
.chat-message {
  &__call {
    &-select {
      border-right: none !important;
      .ant-select-selector {
        border-radius: 8px 0 0 8px !important;
      }
    }
    &-button {
      border-left: none !important;
      padding: 5px 8px!important;
    }
  }
  &__call-button {
    border-radius: 0 8px 8px 0 !important;
  }
}

.chat-header-skeleton {
  .ant-skeleton-button {
    width: 100%!important;
    height: 58px !important;
    display: block;
    border-radius: 12px !important;
  }
}
</style>
