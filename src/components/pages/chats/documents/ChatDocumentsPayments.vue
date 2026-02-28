<script lang="ts" setup>
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import GenerateLinkModal from '@/components/pages/chats/documents/GenerateLinkModal.vue';
import { computed, ref } from 'vue';
import { PaymentDetailInfo, PaymentProvider, PaymentServiceInstance } from '@/services/payments';
import { useRoute } from 'vue-router';
import { getProviderImage } from '@/components/pages/chats/documents/helpers';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import BaseEmpty from '@/components/ui/BaseEmpty.vue';

const route = useRoute();
const $can = useCan();

interface Props {
  paymentDetails: PaymentDetailInfo[]
  loading?: boolean
}

interface Emits {
  (e: 'update-data'): void
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const modalOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const modalType = ref<'create-link' | 'charge'>('create-link');
const modalProvider = ref<PaymentProvider>();
const paymentId = ref<number>();

const leadId = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const openModal = ({ type, paymentDetail, provider }: { type: typeof modalType.value, paymentDetail?: number, provider?: PaymentProvider }) => {
  paymentId.value = paymentDetail;
  modalType.value = type;
  modalOpen.value = true;
  modalProvider.value = provider;
};

const deactivate = async (lId: number, payId: number) => {
  isLoading.value = true;
  try {
    await PaymentServiceInstance.deactivate(lId, payId);
    emit('update-data');
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <a-spin :spinning="loading">
    <div class="bg-white rounded-xl p-3 min-h-[122px]">
      <article>
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-gray-700 text-sm">Payments</h2>
          <a-button
            v-if="$can(PermissionEnum.CREATE_PAYMENT_LINK)"
            class="text-primary-600 flex items-center gap-1 p-0.5"
            type="ghost"
            @click="openModal({ type: 'create-link' })"
          >
            <Icon :icon="Icons.LINK" />
            <span class="font-bold">Create link</span>
          </a-button>
        </div>

        <ul v-if="paymentDetails?.length" class="flex flex-col gap-2">
          <li v-for="payment in paymentDetails" :key="payment.id" class="border border-gray-100 rounded-lg p-2">
            <div class="flex items-center justify-between gap-1 mb-1">
              <a-image
                :preview="false"
                :src="getProviderImage(payment.paymentProvider)"
                style="max-width: 62px; width: auto; height: 16px" />
              <a-button
                v-if="$can(PermissionEnum.CHARGE)"
                class="ms-auto"
                size="small"
                type="primary"
                @click="openModal({ type: 'charge', paymentDetail: payment.id, provider: payment.paymentProvider })">
                <span class="text-xxs" v-if="payment.paymentProvider !== PaymentProvider.ZELLE">Charge</span>
                <span class="text-xxs" v-else>Add payment</span>
              </a-button>
              <a-popconfirm
                v-if="leadId && $can(PermissionEnum.DEACTIVATE_PAYMENT_LINK)"
                title="Are you sure delete this payment?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="deactivate(leadId, payment.id)"
              >
                <a-button
                  class="bg-red-400 text-white flex items-center justify-center min-w-[22px]"
                  size="small"
                  type="ghost"
                >
                  <template #icon>
                    <Icon :icon="Icons.TRASH" :size="12" />
                  </template>
                </a-button>
              </a-popconfirm>
            </div>
            <div class="flex items-center gap-1.5" v-if="payment.cardLastDigits">
              <Icon :icon="Icons.CREDIT_CARD" :size="12" class="text-gray-400" />
              <span class="text-gray-600">**** **** **** {{ payment.cardLastDigits }}</span>
            </div>
          </li>
        </ul>
        <BaseEmpty
          v-else
          description="There are no payments yet"
        />

        <GenerateLinkModal
          v-model:open="modalOpen"
          :leadId="leadId"
          :paymentId="paymentId"
          :type="modalType"
          :provider="modalProvider"
          @handleClose="modalOpen = false"
          @update-data="emit('update-data')"
        />
      </article>
    </div>
  </a-spin>
</template>

<style lang="scss" scoped>

</style>
