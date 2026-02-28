<script setup lang="ts">
import ChatItemEditContactModal from '@/components/pages/chats/ChatItemEditContactModal.vue';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { computed, ref } from 'vue';
import { FullLeadInfo } from '@/services/lead';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { Grid } from 'ant-design-vue';

const { useBreakpoint } = Grid;
const screens = useBreakpoint();
const $can = useCan();

interface ChatItemProps {
  activeLead?: FullLeadInfo
}

interface Emits {
  (e: 'update-lead'): void
  (e: 'back-chat-list'): void
}

defineProps<ChatItemProps>();
const emits = defineEmits<Emits>();

const showEditContactModal = ref(false);

const mobileBack = computed(() => !screens.value?.md);
</script>

<template>
  <button v-if="mobileBack" class="w-8 h-8 bg-gray-50 rounded-lg min-w-8 flex items-center justify-center mr-2" type="button">
    <Icon :icon="Icons.ARROW_LEFT" class="" @click="emits('back-chat-list')" />
  </button>
  <div v-if="activeLead" class="flex flex-col border-r border-gray-100 mr-3 pr-3">
    <a-typography-text class="text-nowrap text-primary text-sm min-w-[60px]">#{{ activeLead.leadNumber }}</a-typography-text>
    <a-typography-text class="text-xs text-gray-400">{{ activeLead.brokerName }}</a-typography-text>
  </div>
  <div class="w-full max-w-[162px] border-r border-gray-100 mr-3 pr-3">
    <p v-if="activeLead?.fullName" class="flex items-center text-sm text-gray-500 text-nowrap">
      <span class="truncate min-minMobile:max-w-[120px] max-w-[70px]">{{ activeLead.fullName }}</span>
      <Icon
        v-if="$can(PermissionEnum.UPDATE_LEAD)"
        :icon="Icons.EDIT"
        class="text-primary ml-2 cursor-pointer"
        size="12"
        @click="showEditContactModal = true"
      />
    </p>
    <p v-if="activeLead?.email" class="text-xs text-gray-400 truncate min-minMobile:max-w-full max-w-[80px]">
      {{ activeLead.email }}
    </p>
  </div>
  <ChatItemEditContactModal
    :open="showEditContactModal"
    :active-lead="activeLead"
    @update:open="showEditContactModal = $event"
    @update-lead="emits('update-lead')"
  />
</template>

<style scoped lang="scss">

</style>
