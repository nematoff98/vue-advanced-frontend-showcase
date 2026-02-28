<script lang="ts" setup>
import ChatLeadVehicleFormModal from '@/components/pages/chats/lead/ChatLeadVehicleFormModal.vue';
import Icon from '@/components/icon/Icon.vue';
import { LeadVehicle, LeadVehicleServiceInstance } from '@/services/lead-vehicle';
import { Icons } from '@/components/icon/helpers';
import { computed, ref } from 'vue';
import { moneyFormat } from '@/utils';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import LeadVehicleImagesModal from '@/components/pages/chats/vehicle/LeadVehicleImagesModal.vue';
import { useCurrentUserStore } from '@/stores/useCurrentUser';

const $can = useCan();
const currrentUser = useCurrentUserStore();

interface Props {
  vehicle: LeadVehicle
  leadId: number | null
}

interface Emits {
  (e: 'updateData'): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formModalOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const openImages = ref<boolean>(false);

const runVehicle = computed(() => {
  if (props.vehicle.isRun) {
    return {
      class: 'text-primary-600',
      text: 'runnable',
    };
  }
  return {
    class: 'text-red-600',
    text: 'non-runnable',
  };
});

const vehicleType = computed(() => (props?.vehicle.type ?? '').charAt(0).toUpperCase() + (props?.vehicle.type ?? '').slice(1));

const deleteLeadVehicle = async () => {
  isLoading.value = true;
  if (!props?.vehicle?.id) return;
  try {
    await LeadVehicleServiceInstance.deleteLeadVehicle(props.vehicle.id);
    emit('updateData');
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <article>
    <div class="flex items-center gap-1 mb-2.5">
      <div class="pr-1">
        <a-avatar
          :src="vehicle.image"
          class="flex-shrink-0 flex items-center justify-center bg-gray-200 cursor-pointer"
          @click="openImages = true"
        >
          <Icon v-if="!vehicle?.image" :icon="Icons.CAR" class="text-gray-500" size="22" />
        </a-avatar>
      </div>
      <div class="flex flex-col">
        <span class="text-gray-700 font-bold">{{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}</span>
        <div class="font-medium">
          <span class="text-gray-500">{{ vehicleType }} - </span><span :class="runVehicle.class">{{ runVehicle.text }}</span>
        </div>
      </div>
      <div class="flex justify-end gap-1.5 ms-auto">
        <a-button
          v-if="$can(PermissionEnum.UPDATE_LEAD_VEHICLE)"
          class="flex items-center justify-center"
          size="small"
          type="primary"
          @click="formModalOpen = true"
        >
          <template #icon>
            <Icon :icon="Icons.EDIT" :size="12" />
          </template>
        </a-button>
        <a-popconfirm
          v-if="$can(PermissionEnum.DELETE_LEAD_VEHICLE)"
          title="Are you sure delete this vehicle?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteLeadVehicle"
        >
          <a-button class="flex items-center justify-center" danger size="small" type="primary">
            <template #icon>
              <Icon :icon="Icons.TRASH" :size="12" />
            </template>
          </a-button>
        </a-popconfirm>
      </div>
    </div>

    <div class="flex items-center justify-between gap-1 flex-wrap">
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500 font-medium">Open price</span>
        <span class="font-bold text-base text-gray-600">{{ moneyFormat(vehicle.priceOpen) }}</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500 font-medium">Enclosed price</span>
        <span class="font-bold text-base text-gray-600">{{ moneyFormat(vehicle.priceEnclosed) }}</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500 font-medium">Deposit</span>
        <span class="font-bold text-base text-primary-600">{{ moneyFormat(vehicle.deposit) }}</span>
      </div>
      <div v-if="currrentUser?.currentUser?.hasOrganizationOceanShipping" class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500 font-medium">Ocean freight</span>
        <span class="font-bold text-base text-primary-600">{{ moneyFormat(vehicle.oceanFee) }}</span>
      </div>
    </div>
    <ChatLeadVehicleFormModal
      v-if="leadId"
      :id="vehicle.id"
      v-model:open="formModalOpen"
      :leadId="leadId"
      :vehicle="vehicle"
      title="Edit vehicle"
      @update-data="emit('updateData')"
    />
    <LeadVehicleImagesModal :vehicle-id="vehicle.id" v-model:open="openImages" />
  </article>
</template>

<style lang="scss" scoped>

</style>
