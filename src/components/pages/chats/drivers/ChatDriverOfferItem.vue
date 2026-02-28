<script lang="ts" setup>
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { LeadOffer, LeadOfferServiceInstance, LeadOfferStatus } from '@/services/lead-offer';
import { loadBoardTextMap } from '@/services/driver';
import { formattedDate, moneyFormat } from '@/utils';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import CopyableText from '@/components/ui/copyable-text/CopyableText.vue';
import { formatPhoneNumber } from '@/utils/format-phone';
import OfferModal from '@/components/pages/chats/offers/OfferModal.vue';

const $can = useCan();

interface Props {
  offer: LeadOffer
}

interface Emits {
  (e: 'update-offers'): void
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const acceptLoading = ref(false);
const openOfferModal = ref(false);
const declineLoading = ref(false);

const date = computed(() => formattedDate(props.offer.createdAt, 'DD MMM. YYYY HH:mm'));
const isBefore = computed(() => dayjs(props.offer.createdAt).isBefore(new Date()));

const acceptOffer = async (offerId: number) => {
  acceptLoading.value = true;
  try {
    await LeadOfferServiceInstance.acceptOffer(offerId);
    emits('update-offers');
  } catch (err) {
    console.error(err);
  } finally {
    acceptLoading.value = false;
  }
};

const declineOffer = async (offerId: number) => {
  declineLoading.value = true;
  try {
    await LeadOfferServiceInstance.declineOffer(offerId);
    emits('update-offers');
  } catch (err) {
    console.error(err);
  } finally {
    declineLoading.value = false;
  }
};
</script>

<template>
  <div class="border border-gray-100 rounded-lg p-2">
    <div class="flex items-center justify-between mb-2">
      <h2
        :class="{ 'text-red-600': isBefore, 'text-gray-600': !isBefore }"
        class="font-bold text-lg"
      >
        {{ moneyFormat(offer.requestPrice) }}
      </h2>
      <div class="flex items-center gap-1">
        <div :class="`offer__${offer.status}`" class="text-xxs h-5 flex items-center gap-0.5 px-2 rounded-[50px] capitalize">
          <!--          <Icon v-if="status === 'Scammer'" :icon="Icons.WARNING" :size="10" />-->
          <span>{{ offer.status }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex items-start gap-1">
        <Icon :icon="Icons.BUILDING2" class="flex-shrink-0 text-gray-400 mt-1" />
        <div class="flex flex-col">
          <span
            class="font-bold text-primary-600 underline cursor-pointer"
            @click="openOfferModal = true"
          >{{ offer.carrierName }}</span>
          <span class="text-gray-500 font-medium text-xs">{{ loadBoardTextMap[offer.loadBoard] }}</span>
        </div>
      </div>
      <div class="flex items-center gap-1.5">
        <Icon :icon="Icons.CALENDAR" class="text-gray-400" />
        <span
          :class="{ 'text-red-600 font-bold': isBefore, 'text-gray-700': !isBefore }"
          class="text-xs"
        >
          {{ date }}
        </span>
      </div>
      <div class="flex items-start gap-1">
        <Icon :icon="Icons.USER" class="flex-shrink-0 text-gray-400 mt-1" />
        <div class="flex flex-col">
          <span class="font-bold text-gray-700">{{ offer.driverName }}</span>
          <div class="flex items-center gap-y-0.5 gap-x-1 flex-wrap">
            <div class="text-gray-500 font-medium text-xs flex items-center gap-1">
              <CopyableText :text="formatPhoneNumber(offer.driverPhone)" />
            </div>
          </div>
        </div>
      </div>
      <a-button
        v-if="offer?.driverPhone"
        class="bg-gray-100 text-gray-700 w-full flex items-center justify-center gap-1"
        type="ghost"
        size="small"
      >
        <Icon :icon="Icons.PHONE_INCOMING" :size="10" />
        <span class="text-xxs">Call driver</span>
      </a-button>
      <div v-if="offer.status === LeadOfferStatus.NEW" class="grid grid-cols-2 gap-1">
        <a-button
          v-if="$can(PermissionEnum.ACCEPT_LEAD_OFFER)"
          class="flex items-center justify-center gap-1"
          size="small"
          type="primary"
          :loading="acceptLoading"
          @click="acceptOffer(offer.id)"
        >
          <Icon :icon="Icons.CHECK" />
          <span class="text-xxs">Accept</span>
        </a-button>
        <a-popconfirm
          title="Are you sure you want to reject this offer?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="declineOffer(offer.id)"
        >
          <a-button
            v-if="$can(PermissionEnum.DECLINE_LEAD_OFFER)"
            class="flex items-center justify-center gap-1 bg-red-400 text-white"
            size="small"
            type="ghost"
            :loading="declineLoading"
          >
            <Icon :icon="Icons.X" size="13" />
            <span class="text-xxs">Reject</span>
          </a-button>
        </a-popconfirm>
      </div>
    </div>
    <OfferModal
      v-model:open="openOfferModal"
      :offer="offer"
      @update-offers="emits('update-offers')"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
