<script lang="ts" setup>
import LBPriceModal from '@/components/pages/chats/lead/LBPriceModal.vue';
import { ref } from 'vue';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';

const $can = useCan();

interface Emits {
  (e: 'update:vehicle'): void;
}

const emit = defineEmits<Emits>();

const modalOpen = ref(false);
</script>

<template>
  <a-button
    v-if="$can([PermissionEnum.GET_SD_PRICE, PermissionEnum.GET_CD_PRICE])"
    class="w-full"
    type="primary"
    @click="modalOpen = true"
  >View Quote Prices</a-button>
  <LBPriceModal
    v-model:open="modalOpen"
    @update:vehicle="emit('update:vehicle')"
  />
</template>

<style lang="scss" scoped>

</style>
