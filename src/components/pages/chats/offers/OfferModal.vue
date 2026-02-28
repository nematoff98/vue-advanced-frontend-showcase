<script setup lang="ts">
import { LeadOffer, LeadOfferServiceInstance } from '@/services/lead-offer';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { ref, watch } from 'vue';
import { loadBoardTextMap } from '@/services/driver';

interface Props {
  offer: LeadOffer
}

interface Emits {
  (e: 'update-offers'): void
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const open = defineModel('open', { type: Boolean });

const rate = ref<number>();
const blockLoading = ref(false);

watch(() => open.value, (newValue) => {
  if (newValue && props.offer?.carrierRate) {
    rate.value = +props.offer.carrierRate;
  }
});

const blockCarrier = async () => {
  if (!props.offer?.id) return;
  blockLoading.value = true;
  try {
    await LeadOfferServiceInstance.blockCarrier(props.offer.id);
    emits('update-offers');
    open.value = false;
  } catch (err) {
    console.error(err);
  } finally {
    blockLoading.value = false;
  }
};

const rateCarrier = async () => {
  if (!props.offer?.id || !rate.value) return;
  blockLoading.value = true;
  try {
    await LeadOfferServiceInstance.rateCarrier(props.offer.id, rate.value);
  } catch (err) {
    console.error(err);
  } finally {
    blockLoading.value = false;
  }
};
</script>

<template>
  <a-modal
    v-model:open="open"
    :footer="null"
    title="Offer details"
    width="650px"
  >
    <a-row :gutter="[16, 16]">
      <a-col :span="12">
        <p class="text-gray-500 mb-0">Name</p>
        <p class="text-[14px] font-bold">{{ offer.carrierContactName }}</p>
      </a-col>
      <a-col :span="12">
        <p class="text-gray-500 mb-0">Load Board</p>
        <p class="text-[14px] font-bold">{{ loadBoardTextMap[offer.loadBoard] }}</p>
      </a-col>
      <a-col :span="12">
        <p class="text-gray-500 mb-0">Phone</p>
        <p class="text-[14px] font-bold">{{ offer.carrierPhone }}</p>
      </a-col>
      <a-col :span="12">
        <p class="text-gray-500 mb-0">Email</p>
        <p class="text-[14px] font-bold">{{ offer.carrierEmail }}</p>
      </a-col>
      <a-col :span="12">
        <p class="text-gray-500 mb-0">Address</p>
        <p class="text-[14px] font-bold">{{ offer.carrierAddress }}</p>
      </a-col>
      <a-col :span="12">
        <p class="text-gray-500 mb-0">MC Number</p>
        <p class="text-[14px] font-bold">{{ offer.carrierMcNumber }}</p>
      </a-col>
      <a-col :span="12">
        <p class="text-gray-500 mb-0">DOT Number</p>
        <p class="text-[14px] font-bold">{{ offer.carrierDotNumber }}</p>
      </a-col>
      <a-col :span="12">
        <p class="text-gray-500 mb-0">Insurance</p>
        <a
          :href="offer.carrierInsuranceUrl"
          class="text-[14px] font-bold flex items-center gap-1 text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Insurance Doc
          <Icon :icon="Icons.DOCUMENT" />
        </a>
      </a-col>
      <a-col :span="12">
        <p class="text-gray-500 mb-0">Status</p>
        <div class="flex items-center">
          <p
            class="text-xxs h-5 items-center gap-0.5 px-2 rounded-[50px] capitalize flex"
            :class="`offer__${offer.carrierStatus}`"
          >{{ offer.carrierStatus }}</p>
        </div>
      </a-col>
      <a-col :span="12">
        <p class="text-gray-500 mb-0">Rate</p>
        <a-rate v-model:value="rate" @change="rateCarrier" />
      </a-col>
    </a-row>
    <div class="flex justify-end mt-3 pt-3 border-t dark:border-gray-400">
      <a-popconfirm
        title="Are you sure you want to block this carrier?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="blockCarrier"
      >
        <a-button
          type="primary"
          danger
          :loading="blockLoading"
        >Add to blacklist</a-button>
      </a-popconfirm>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
