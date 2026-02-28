<script lang="ts" setup>
import ChatLeadAddressFormModal from '@/components/pages/chats/lead/ChatLeadAddressFormModal.vue';
import ChatLeadAddressMapModal from '@/components/pages/chats/lead/ChatLeadAddressMapModal.vue';
import { LeadAddressType } from '@/services/lead-address/lead-address.list';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { Address, LeadAddress } from '@/services/lead-address';
import { FullLeadInfo } from '@/services/lead';
import { computed, ref } from 'vue';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { formatPhoneNumber } from '../../../../utils/format-phone';

const $can = useCan();

interface Props {
  location: Address,
  address?: LeadAddress
  lead?: FullLeadInfo
  type: LeadAddressType
}

interface Emits {
  (e: 'updateData'): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const title = computed(() => (props.type === LeadAddressType.ORIGIN ? 'Origin' : 'Destination'));
const residential = computed(() => (props.location.isResidential ? 'Residential' : 'Business'));
const routeOpen = ref<boolean>(false);
const formModal = ref(false);
</script>

<template>
  <div class="flex justify-between items-center gap-1 mb-2">
    <h2 class="text-gray-700 font-bold">{{ title }} address</h2>
    <button v-if="$can(PermissionEnum.UPDATE_LEAD_ADDRESS)" class="flex items-center gap-1 text-primary-600 font-bold" type="button" @click="formModal = true">
      <Icon :icon="Icons.EDIT" class="flex-shrink-0" />
      <span class="font-bold">Edit</span>
    </button>
  </div>
  <div class="flex flex-col gap-2">
    <div class="flex items-start justify-between gap-1">
      <div class="flex items-start gap-1">
        <Icon v-if="location?.port?.id" :icon="Icons.PORT" class="flex-shrink-0 text-gray-400 mt-1" />
        <Icon v-else :icon="Icons.MAP_MARKER" class="flex-shrink-0 text-gray-400 mt-1" />
        <div class="flex flex-col">
          <span class="font-bold text-gray-700">{{ location.city }}, {{ location.state }} {{ location.zip }}</span>
          <span class="text-gray-400 font-medium text-xxs">{{ location.address }}</span>
        </div>
      </div>
      <div class="flex flex-col items-end gap-0.5 flex-shrink-0 text-xxs">
        <!--        <span class="text-gray-700 font-medium">{{ location.createdAt }}</span>-->
        <span class="font-bold text-gray-700">{{ residential }}</span>
      </div>
    </div>
    <div class="flex items-center gap-1">
      <Icon :icon="Icons.USER" class="flex-shrink-0 text-gray-400 mt-1" />
      <div class="flex flex-col">
        <span class="font-bold text-gray-700">{{ location.contactName }}</span>
        <span class="text-gray-400 font-medium text-xxs">{{ formatPhoneNumber(location.phone) }}</span>
      </div>
    </div>
  </div>

  <ChatLeadAddressMapModal
    v-model:open="routeOpen"
    :addresses="address"
  />
  <ChatLeadAddressFormModal
    :open="formModal"
    :type="type"
    :lead="lead"
    :location="location"
    :address="address"
    @update:open="formModal = $event"
    @update-data="emit('updateData')"
  />
</template>

<style lang="scss" scoped>

</style>
