<script lang="ts" setup>
import ChatLeadTimeline from '@/components/pages/chats/lead/ChatLeadTimeline.vue';
import { LeadTimeline } from '@/services/lead-timeline';

interface Props {
  open: boolean
  timeline: LeadTimeline[]
}

interface Emits {
  (e: 'update:open', open: boolean): void
}

defineProps<Props>();

const emit = defineEmits<Emits>();

const closeModal = () => {
  emit('update:open', false);
};

</script>

<template>
  <a-modal
    :footer="null"
    :open="open"
    :mask-closable="false"
    closable
    title="Timeline"
    width="550px"
    @cancel="closeModal"
  >
    <ChatLeadTimeline v-if="timeline" :hideShowMore="true" :timelines="timeline" is-modal />
  </a-modal>
</template>

<style lang="scss" scoped>

</style>
