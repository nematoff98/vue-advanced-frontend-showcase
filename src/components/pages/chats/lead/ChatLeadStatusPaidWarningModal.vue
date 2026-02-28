<script lang="ts" setup>
interface Props {
  loading?: boolean;
}

interface Emits {
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

const open = defineModel('open', { type: Boolean, default: false });

defineProps<Props>();
const emits = defineEmits<Emits>();
</script>

<template>
  <a-modal
    :open="open"
    centered
    title="Payment not completed"
    :mask-closable="false"
    ok-text="Yes, change"
    cancel-text="No"
    :confirm-loading="loading"
    @ok="emits('confirm')"
    @cancel="emits('cancel')"
    @update:open="open = false"
  >
    <p class="text-sm text-gray-600">
      The payment is not completed. Are you sure you want to change the status to Paid?
    </p>
  </a-modal>
</template>
