<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { PaymentDetailInfo, PaymentServiceInstance, TransactionInfo } from '@/services/payments';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { FullLeadInfo } from '@/services/lead';
import ChatDocumentsContracts from './ChatDocumentsContracts.vue';
import ChatDocumentsPayments from './ChatDocumentsPayments.vue';
import ChatDocumentsChecks from './ChatDocumentsChecks.vue';

const route = useRoute();
const $can = useCan();

interface Props {
  activeLead?: FullLeadInfo
}

defineProps<Props>();

const isPaymentsLoading = ref(false);
const isTransactionLoading = ref(false);
const leadTransactions = ref<TransactionInfo[]>([]);
const paymentDetails = ref<PaymentDetailInfo[]>([]);

const id = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const fetchLeadTransactions = async (leadId: number) => {
  isTransactionLoading.value = true;
  try {
    leadTransactions.value = await PaymentServiceInstance.getLeadTransactions(leadId);
  } catch (err) {
    console.error(err);
  } finally {
    isTransactionLoading.value = false;
  }
};

const fetchPaymentDetails = async (leadId: number) => {
  isPaymentsLoading.value = true;
  try {
    paymentDetails.value = await PaymentServiceInstance.getLeadPaymentDetails(leadId);
  } catch (err) {
    console.error(err);
  } finally {
    isPaymentsLoading.value = false;
  }
};

const updateData = () => {
  if (!id.value) return;
  fetchLeadTransactions(id.value);
  fetchPaymentDetails(id.value);
};

watchEffect(() => {
  if (id.value) {
    fetchLeadTransactions(id.value);
    fetchPaymentDetails(id.value);
  }
});
</script>

<template>
  <div class="flex flex-col gap-4 mt-4">
    <ChatDocumentsContracts
      v-if="$can(PermissionEnum.GET_LEAD_CONTRACTS)"
      :active-lead="activeLead"
    />
    <ChatDocumentsPayments
      v-if="$can(PermissionEnum.GET_LEAD_PAYMENT_DETAILS)"
      :payment-details="paymentDetails"
      :loading="isPaymentsLoading"
      @update-data="updateData"
    />
    <ChatDocumentsChecks
      v-if="$can(PermissionEnum.GET_LEAD_TRANSACTIONS)"
      :transactions="leadTransactions"
      :loading="isTransactionLoading"
      @update-data="updateData"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
