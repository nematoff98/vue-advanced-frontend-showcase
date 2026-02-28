<script lang="ts" setup>
import PostToLeadBoard from '@/components/pages/chats/drivers/PostToLeadBoard.vue';
import ChatDriverOffers from '@/components/pages/chats/drivers/ChatDriverOffers.vue';
import ChatDriverInfo from '@/components/pages/chats/drivers/ChatDriverInfo.vue';
import { FullLeadInfo } from '@/services/lead';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { LeadAddress } from '@/services/lead-address';
import { ChatLeadInfoTabs } from '@/services/chat';

const $can = useCan();

interface Props {
  lead?: FullLeadInfo
  loading?: boolean
  addresses?: LeadAddress
  activeTab: ChatLeadInfoTabs
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <PostToLeadBoard
      v-if="$can(PermissionEnum.LIST_LEAD_POST)"
      :lead="lead"
      :addresses="addresses"
      :active-tab="activeTab"
    />
    <ChatDriverInfo
      v-if="$can(PermissionEnum.GET_DRIVERS_LIST)"
    />
    <ChatDriverOffers
      v-if="$can(PermissionEnum.GET_LEAD_OFFERS)"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
