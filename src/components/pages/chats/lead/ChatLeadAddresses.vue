<script lang="ts" setup>
import ChatLeadAddressMapModal from '@/components/pages/chats/lead/ChatLeadAddressMapModal.vue';
import ChatLeadAddressesItem from '@/components/pages/chats/lead/ChatLeadAddressesItem.vue';
import { LeadAddress } from '@/services/lead-address';
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import {
  computed, ref,
} from 'vue';
import { FullLeadInfo } from '@/services/lead';
import { LeadAddressType } from '@/services/lead-address/lead-address.list';

interface ChatLeadInfoProps {
  lead?: FullLeadInfo
  addresses?: LeadAddress
  addressLoading?: boolean
}

interface Emits {
  (e: 'update-addresses'): void;
}

const props = defineProps<ChatLeadInfoProps>();
const emits = defineEmits<Emits>();

const routeOpen = ref<boolean>(false);

const origin = computed(() => props.addresses?.origin);
const destination = computed(() => props.addresses?.destination);

const showMapModal = () => {
  routeOpen.value = true;
};
</script>

<template>
  <a-spin :spinning="addressLoading">
    <div class="min-h-[258px] bg-white rounded-2xl p-3 mt-4">
      <article v-if="origin && destination" class="">
        <div class="flex justify-between items-center gap-1 pb-3 mb-2 border-b border-gray-100">
          <h2 class="text-gray-700 font-bold">Addresses</h2>
          <button class="flex items-center gap-1 text-primary-600 font-bold" type="button" @click="showMapModal">
            <Icon :icon="Icons.MAP_MARKER" class="flex-shrink-0" />
            <span class="font-bold">View route</span>
          </button>
        </div>
        <ChatLeadAddressesItem
          :location="origin"
          :address="addresses"
          :lead="lead"
          :type="LeadAddressType.ORIGIN"
          @update-data="emits('update-addresses')"
        />
        <a-divider class="my-2" dashed />
        <ChatLeadAddressesItem
          :location="destination"
          :address="addresses"
          :lead="lead"
          :type="LeadAddressType.DESTINATION"
          @update-data="emits('update-addresses')"
        />

        <ChatLeadAddressMapModal v-model:open="routeOpen" :addresses="addresses" />
      </article>
    </div>
  </a-spin>
</template>

<style lang="scss" scoped>

</style>
