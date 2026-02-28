<script lang="ts" setup>
import ChatLeadTimelineCard from '@/components/pages/chats/lead/ChatLeadTimelineCard.vue';
import ChatLeadAddresses from '@/components/pages/chats/lead/ChatLeadAddresses.vue';
import ChatLeadVehicles from '@/components/pages/chats/lead/ChatLeadVehicles.vue';
import ChatDocuments from '@/components/pages/chats/documents/ChatDocuments.vue';
import ChatDrivers from '@/components/pages/chats/drivers/ChatDrivers.vue';
import ChatLeadInfo from '@/components/pages/chats/lead/ChatLeadInfo.vue';
import { FullLeadInfo } from '@/services/lead';
import {
  computed, onMounted, ref, watch,
} from 'vue';
import { ChatFullInfo, ChatLeadInfoTabs } from '@/services/chat';
import ChatLeadNote from '@/components/pages/chats/lead/ChatLeadNote.vue';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { LeadAddress, LeadAddressServiceInstance } from '@/services/lead-address';
import { useRoute } from 'vue-router';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { Grid } from 'ant-design-vue';

const { useBreakpoint } = Grid;
const screens = useBreakpoint();

const $can = useCan();
const route = useRoute();

interface ChatLeadDetailsProps {
  activeLead?: FullLeadInfo
  activeLeadLoading?: boolean
  chatFullInfo?: ChatFullInfo
}

interface ChatLeadDetailsEmits {
  (e: 'update-lead'): void
  (e: 'close-lead-info'): void
}

defineProps<ChatLeadDetailsProps>();
const emits = defineEmits<ChatLeadDetailsEmits>();

const activeTab = ref(ChatLeadInfoTabs.LEAD);
const addressLoading = ref(false);
const isVehicleUpdate = ref(false);
const addresses = ref<LeadAddress>();

const id = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const fetchLeadAddresses = async () => {
  const { leadId } = route.query;
  if (!leadId) return;
  addressLoading.value = true;
  try {
    addresses.value = await LeadAddressServiceInstance.getLeadAddresses(+leadId);
  } catch (err) {
    console.error(err);
  } finally {
    addressLoading.value = false;
  }
};

const vehicleUpdate = () => {
  isVehicleUpdate.value = true;
  emits('update-lead');
  setTimeout(() => {
    isVehicleUpdate.value = false;
  }, 1000);
};

onMounted(() => {
  fetchLeadAddresses();
});

watch(() => id.value, (leadId) => {
  if (leadId) fetchLeadAddresses();
});
</script>

<template>
  <section class="chat-lead-details max-h-full overflow-y-auto scroll-hidden">
    <a-tabs
      v-model:activeKey="activeTab"
      class="tab-button"
    >
      <a-tab-pane :key="ChatLeadInfoTabs.LEAD" tab="Lead">
        <ChatLeadInfo
          :lead="activeLead"
          :loading="activeLeadLoading"
          :chat-full-info="chatFullInfo"
          @update-lead="emits('update-lead')"
          @update:vehicle="vehicleUpdate"
        />
        <ChatLeadAddresses
          v-if="$can(PermissionEnum.GET_LEAD_ADDRESSES)"
          :addresses="addresses"
          :address-loading="addressLoading"
          :lead="activeLead"
          @update-addresses="fetchLeadAddresses"
        />
        <ChatLeadVehicles
          v-if="$can(PermissionEnum.VIEW_LEAD_VEHICLE)"
          :is-update="isVehicleUpdate"
          @update-lead="emits('update-lead')"
        />
        <ChatLeadNote
          v-if="$can(PermissionEnum.UPDATE_LEAD)"
          :active-lead="activeLead"
          :loading="activeLeadLoading"
        />
        <ChatLeadTimelineCard
          v-if="$can(PermissionEnum.GET_LEAD_TIMELINES)"
        />
      </a-tab-pane>
      <a-tab-pane :key="ChatLeadInfoTabs.DOCUMENTS" tab="Order">
        <ChatDocuments
          :active-lead="activeLead"
        />
      </a-tab-pane>
      <a-tab-pane :key="ChatLeadInfoTabs.DRIVERS" tab="Carrier">
        <ChatDrivers
          :lead="activeLead"
          :addresses="addresses"
          :active-tab="activeTab"
        />
      </a-tab-pane>
      <template v-if="!screens?.xxl && !screens?.xl" #rightExtra>
        <button
          type="button"
          @click="emits('close-lead-info')"
          class="w-12 h-12 ml-2 rounded-lg bg-gray-50 flex items-center justify-center text-gray-800 active:scale-95"
        >
          <Icon :icon="Icons.X" size="22" />
        </button>
      </template>
    </a-tabs>
  </section>

</template>

<style lang="scss" scoped>
:global(.ant-tabs-nav) {
  @apply p-2 bg-white rounded-2xl
}

@media screen and (max-width: 1250px) {
  .chat-lead-details {
    max-height: calc(100% - 80px);
  }
}
</style>
