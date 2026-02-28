<script lang="ts" setup>
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import ChatLeadVehicleFormModal from '@/components/pages/chats/lead/ChatLeadVehicleFormModal.vue';
import ChatLeadVehicleItem from '@/components/pages/chats/lead/ChatLeadVehicleItem.vue';
import { LeadVehicle, LeadVehicleServiceInstance } from '@/services/lead-vehicle';
import { useRoute } from 'vue-router';
import {
  computed, onMounted, ref, watch,
} from 'vue';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';

interface Emits {
  (e: 'update-lead'): void
}

interface Props {
  isUpdate?: boolean
}

const emits = defineEmits<Emits>();
const props = defineProps<Props>();
const $can = useCan();

const formModalOpen = ref<boolean>(false);

const route = useRoute();

const isLoading = ref(false);

const leadVehicles = ref<LeadVehicle[]>([]);

const leadId = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const fetchLeadVehicleList = async () => {
  if (!leadId.value) return;
  isLoading.value = true;
  try {
    leadVehicles.value = await LeadVehicleServiceInstance.getLeadVehicleList(+leadId.value);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const updateData = () => {
  fetchLeadVehicleList();
  emits('update-lead');
};

onMounted(() => {
  fetchLeadVehicleList();
});
watch(leadId, (() => {
  if (leadId.value) fetchLeadVehicleList();
}));

watch(() => props.isUpdate, () => {
  if (props.isUpdate) {
    fetchLeadVehicleList();
  }
});

</script>

<template>
  <a-spin :spinning="isLoading">
    <article class="bg-white rounded-2xl p-3 min-h-[100px] mt-4">
      <div class="flex justify-between items-center gap-1 pb-3 mb-2 border-b border-gray-100">
        <h2 class="text-gray-700 font-bold">Vehicles</h2>
        <button
          v-if="$can(PermissionEnum.ADD_LEAD_VEHICLE)"
          class="flex items-center gap-1 text-primary-600 font-bold"
          type="button"
          @click="formModalOpen = true"
        >
          <Icon :icon="Icons.PLUS" class="flex-shrink-0" />
          <span class="font-bold">Add</span>
        </button>
      </div>
      <ul v-if="leadVehicles?.length">
        <li
          v-for="leadVehicle in leadVehicles"
          :key="leadVehicle.id"
          class="border-b border-gray-100 pb-2 mb-2 last:border-none last:pb-0 last:mb-2"
        >
          <ChatLeadVehicleItem
            :leadId="leadId"
            :vehicle="leadVehicle"
            @update-data="updateData"
          />
        </li>
      </ul>
      <a-empty v-else description="No vehicle found" />
      <ChatLeadVehicleFormModal
        v-if="leadId"
        v-model:open="formModalOpen"
        :leadId="leadId"
        title="Add new vehicle"
        @update-data="updateData"
      />
    </article>
  </a-spin>
</template>

<style lang="scss" scoped>

</style>
