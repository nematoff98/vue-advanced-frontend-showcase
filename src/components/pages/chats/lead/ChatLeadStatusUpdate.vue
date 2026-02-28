<script lang="ts" setup>
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import ChatLeadStatusPaidWarningModal from '@/components/pages/chats/lead/ChatLeadStatusPaidWarningModal.vue';
import {
  FullLeadInfo, LeadServiceInstance, LeadStatus, leadStatusColorMap, leadStatusTextMap, UpdateLeadActionsForm,
} from '@/services/lead';
import { computed, ref } from 'vue';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { PaymentServiceInstance, PaymentStatus, TransactionInfo } from '@/services/payments';
import { useRoute } from 'vue-router';

const $can = useCan();
const route = useRoute();

interface ChatLeadInfoProps {
  lead: FullLeadInfo
}

interface ChatLeadInfoEmits {
  (e: 'updateLead'): void
}

const props = defineProps<ChatLeadInfoProps>();
const emits = defineEmits<ChatLeadInfoEmits>();

const isLoading = ref(false);
const isTransactionLoading = ref(false);
const openWarning = ref(false);
const pendingStatus = ref<LeadStatus | null>(null);
const leadTransactions = ref<TransactionInfo[]>();

const list = Object.entries(leadStatusTextMap).map(([key, label]) => ({
  key: key as LeadStatus,
  label,
}));

const updateLeadSpecificDetails = async (params: UpdateLeadActionsForm) => {
  isLoading.value = true;
  try {
    await LeadServiceInstance.updateLead(props.lead.id, params);
    emits('updateLead');
    leadTransactions.value = undefined;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const hasSuccessfulPayment = computed(() => leadTransactions.value?.some((transaction) => transaction.status === PaymentStatus.SUCCEEDED));

const confirmPaidStatus = async () => {
  if (!pendingStatus.value) return;
  try {
    await updateLeadSpecificDetails({ status: pendingStatus.value });
    openWarning.value = false;
    pendingStatus.value = null;
  } catch (err) {
    console.error(err);
  }
};

const cancelPaidStatus = () => {
  openWarning.value = false;
  pendingStatus.value = null;
};

const fetchLeadTransactions = async () => {
  const { leadId } = route.query;
  if (!leadId) return;
  isTransactionLoading.value = true;
  try {
    leadTransactions.value = await PaymentServiceInstance.getLeadTransactions(+leadId);
    if (!leadTransactions.value) leadTransactions.value = [];
  } catch (err) {
    console.error(err);
  } finally {
    isTransactionLoading.value = false;
  }
};

const changeLeadStatus = async (params: UpdateLeadActionsForm) => {
  if (params.status !== LeadStatus.PAID) {
    await updateLeadSpecificDetails(params);
    return;
  }

  if (!leadTransactions.value && !isTransactionLoading.value) {
    isLoading.value = true;
    await fetchLeadTransactions();
    isLoading.value = false;
  }

  if (hasSuccessfulPayment.value) {
    await updateLeadSpecificDetails(params);
    return;
  }

  pendingStatus.value = LeadStatus.PAID;
  openWarning.value = true;
};
</script>

<template>
  <a-dropdown v-if="lead" :trigger="['click']">
    <a-button
      :style="{ backgroundColor: leadStatusColorMap[lead.status].bgColor, color: leadStatusColorMap[lead.status].color }"
      class="rounded-[50px] text-xxs font-medium flex items-center gap-0.5 py-1 px-2 h-5 min-h-5 border-none"
      :loading="isLoading"
    >
      <span>{{ leadStatusTextMap[lead.status] }}</span>
      <Icon v-if="$can(PermissionEnum.UPDATE_LEAD)" :icon="Icons.CHEVRON_DOWN" size="10" />
    </a-button>
    <template v-if="$can(PermissionEnum.UPDATE_LEAD)" #overlay>
      <a-menu>
        <a-menu-item
          v-for="status in list"
          :key="status.key"
          @click="changeLeadStatus({ status: status.key })"
        >
          {{ status.label }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <ChatLeadStatusPaidWarningModal
    v-model:open="openWarning"
    :loading="isLoading"
    @confirm="confirmPaidStatus"
    @cancel="cancelPaidStatus"
  />
</template>

<style lang="scss" scoped>

</style>
