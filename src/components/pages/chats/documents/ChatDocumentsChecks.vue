<script lang="ts" setup>
import ReasonModal from '@/components/pages/chats/documents/ReasonModal.vue';
import Icon from '@/components/icon/Icon.vue';
import {
  PaymentProvider, PaymentPurpose, PaymentServiceInstance, paymentStatusTextMap, TransactionInfo,
} from '@/services/payments';
import { Icons } from '@/components/icon/helpers';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { formattedDate, moneyFormat } from '@/utils';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import CopyableTextAsync from '@/components/ui/copyable-text/CopyableTextAsync.vue';
import { getProviderImage } from '@/components/pages/chats/documents/helpers';
import BaseEmpty from '@/components/ui/BaseEmpty.vue';

const route = useRoute();
const $can = useCan();

interface ChatDocumentsChecksProps {
  transactions: TransactionInfo[]
  loading?: boolean
}

defineProps<ChatDocumentsChecksProps>();

const isLoading = ref(false);

const id = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const currentTransaction = ref<TransactionInfo>();
const isReasonModalOpen = ref(false);

const openReasonModal = (transaction: TransactionInfo) => {
  currentTransaction.value = transaction;
  isReasonModalOpen.value = true;
};

const submit = async (reason: string) => {
  if (id.value && currentTransaction.value?.amount) {
    isLoading.value = true;
    try {
      await PaymentServiceInstance.refund(id.value, currentTransaction.value.id, {
        amount: currentTransaction.value.amount,
        reason,
      });
      isReasonModalOpen.value = false;
      notification.success({
        message: 'Successfully',
        description: 'Transaction successfully refunded',
      });
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }
};

const getPurposeImage = (purpose: PaymentPurpose) => (purpose === PaymentPurpose.DRIVER ? Icons.CAR : Icons.BUILDING2);

const fetchPaymentLink = async (transactionId: number): Promise<string | undefined> => {
  if (!id.value) return undefined;

  try {
    return await PaymentServiceInstance.getLink(id.value, transactionId);
  } catch (e) {
    console.error(e);
  }

  return undefined;
};

const openPrintScreenImage = (url: string) => {
  try {
    window.open(url, '_blank');
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <a-spin :spinning="loading">
    <div class="bg-white rounded-xl p-3 min-h-[100px]">
      <article class="bg-white rounded-xl">
        <h2 class="font-bold text-gray-700 text-sm mb-2">Transactions</h2>

        <ul class="flex flex-col gap-2" v-if="transactions.length">
          <li v-for="transaction in transactions" :key="transaction.id" class="border border-gray-100 rounded-lg p-2">
            <div class="grid items-center gap-1" :class="transaction.paymentProvider ? 'grid-cols-3' : 'grid-cols-2'">
              <div class="flex flex-col gap-0.5">
                <span class="text-xxs text-gray-400 font-medium">Contract:</span>
                <span class="text-base text-primary-600 font-bold">{{ moneyFormat(transaction.amount) }}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-xxs text-gray-400 font-medium">Actual:</span>
                <span v-if="transaction?.amountWithFee" class="text-base text-gray-600 font-bold">{{ moneyFormat(+transaction.amountWithFee) }}</span>
              </div>
              <div v-if="transaction?.paymentProvider" class="justify-self-end mr-2">
                <a-image :preview="false" :src="getProviderImage(transaction.paymentProvider)" style="max-width: 62px; width: auto; height: 16px" />
              </div>
            </div>

            <a-divider class="bg-gray-100 mt-1.5 mb-2" />

            <ul class="flex flex-col gap-1 mb-2">
              <li>
                <div class="flex items-center gap-1.5">
                  <Icon :icon="Icons.CREDIT_CARD" class="text-gray-400" />
                  <span
                    class="text-gray-600"
                    v-if="transaction.isItLinkTransaction"
                  >
                    <CopyableTextAsync
                      text="Payment link"
                      :value="() => fetchPaymentLink(transaction.id)"
                    />
                  </span>
                  <span
                    v-else-if="transaction.paymentProvider !== PaymentProvider.ZELLE"
                    class="text-gray-600"
                  >
                    **** **** **** {{ transaction.cardLastDigits }}
                  </span>
                  <span
                    v-else
                    class="text-gray-600"
                  >
                    Zelle payment
                  </span>
                  <div class="bg-green-100 rounded-[50px] w-max py-1 px-2 text-green-700 text-xxs font-medium ms-auto">
                    {{ paymentStatusTextMap[transaction.status] }}
                  </div>
                </div>
              </li>
              <li>
                <div class="flex items-center gap-1.5">
                  <Icon :icon="Icons.CALENDAR" class="text-gray-400" />
                  <span class="text-gray-600">{{ formattedDate(transaction.createdAt, 'MMM DD, HH:mm') }}</span>
                </div>
              </li>
              <li>
                <div class="flex items-center gap-1.5">
                  <Icon :icon="getPurposeImage(transaction.purpose)" class="text-gray-400" />
                  <span class="text-gray-600 capitalize">{{ transaction.purpose }}</span>
                </div>
              </li>
            </ul>

            <div class="flex justify-between items-center gap-1">
              <a-button
                class="flex gap-1 items-center text-primary-600"
                size="small"
                style="padding: 0 !important;"
                type='ghost'
                v-if="transaction.printScreenImage"
                @click="openPrintScreenImage(transaction.printScreenImage)"
              >
                <Icon :icon="Icons.PRINTER" />
                <span>Print screen image</span>
              </a-button>
              <a-button
                v-if="transaction.isRefundable && $can(PermissionEnum.REFUND)"
                class="flex gap-1 items-center text-white"
                size="small"
                type="primary"
                @click="openReasonModal(transaction)"
              >
                <Icon :icon="Icons.REPEAT" :size="12" />
                <span class="text-xxs font-medium">Refund</span>
              </a-button>
            </div>
          </li>
        </ul>
        <BaseEmpty
          v-else
          description="There are no transactions yet"
        />
        <ReasonModal v-model:open="isReasonModalOpen" :loading="isLoading" @submit="submit" />
      </article>
    </div>
  </a-spin>
</template>

<style lang="scss" scoped>

</style>
