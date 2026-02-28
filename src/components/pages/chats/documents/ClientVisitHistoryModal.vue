<script lang="ts" setup>

import ClientVisitHistory from '@/components/pages/chats/documents/ClientVisitHistory.vue';

interface Props {
  open: boolean
  leadId: number;
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
    :destroyOnClose="true"
    :footer="null"
    :mask-closable="false"
    closable
    :open="open"
    title="Client visits histories"
    width="550px"
    @cancel="closeModal"
  >
    <ClientVisitHistory :leadId="leadId" />
  </a-modal>
</template>

<style lang="scss" scoped>

</style>
