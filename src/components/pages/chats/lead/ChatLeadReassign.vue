<script lang="ts" setup>
import ChatLeadReassignModal from '@/components/pages/chats/lead/ChatLeadReassignModal.vue';
import { ref } from 'vue';
import { ChatFullInfo } from '@/services/chat';
import { FullLeadInfo } from '@/services/lead';

interface Props {
  chatFullInfo?: ChatFullInfo
  lead?: FullLeadInfo
}

defineProps<Props>();

const modalOpen = ref(false);
</script>

<template>
  <a-button
    class="w-full"
    type="primary"
    @click="modalOpen = true"
  >Reassign</a-button>
  <ChatLeadReassignModal
    v-model:open="modalOpen"
    :chat-full-info="chatFullInfo"
    :lead="lead"
  />
</template>

<style lang="scss" scoped>

</style>
