<script lang="ts" setup>
import LBPriceModalContent from './LBPriceModalContent.vue';

interface Props {
  open: boolean;
}

interface Emits {
  (e: 'update:open', open: boolean): void;
  (e: 'update:vehicle'): void;
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
    title="Load board price"
    width="550px"
    :mask-closable="false"
    closable
    @cancel="closeModal"
  >
    <LBPriceModalContent
      :open="open"
      @update:vehicle="emit('update:vehicle')"
    />
  </a-modal>
</template>

<style lang="scss" scoped>
</style>
