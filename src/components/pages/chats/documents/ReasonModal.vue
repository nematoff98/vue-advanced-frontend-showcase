<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  open: boolean;
  loading: boolean
}

interface Emits {
  (e: 'update:open', open: boolean): void;

  (e: 'submit', reason: string): void;
}

defineProps<Props>();

const emit = defineEmits<Emits>();
const reason = ref('');

const closeModal = () => {
  emit('update:open', false);
};

const submit = () => {
  emit('submit', reason.value);
  closeModal();
};
</script>

<template>
  <a-modal
    :footer="null"
    :open="open"
    title="Reason"
    :mask-closable="false"
    closable
    width="550px"
    @cancel="closeModal"
  >
    <form @submit.prevent="submit">
      <a-textarea v-model:value="reason" class="mb-5" placeholder="Reason" />

      <div class="flex justify-end gap-2">
        <a-button class="bg-gray-50" html-type="button" type="ghost" @click="closeModal">Cancel</a-button>
        <a-button html-type="submit" type="primary" :loading="loading">Save</a-button>
      </div>
    </form>
  </a-modal>
</template>
