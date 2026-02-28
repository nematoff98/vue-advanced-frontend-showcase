<script lang="ts" setup>
import ChatDriverFormModal from '@/components/pages/chats/drivers/ChatDriverFormModal.vue';
import Icon from '@/components/icon/Icon.vue';
import { Driver, DriverServiceInstance, loadBoardTextMap } from '@/services/driver';
import { formatPhoneNumber } from '@/utils/format-phone';
import { Icons } from '@/components/icon/helpers';
import { useRoute } from 'vue-router';
import { computed, ref, watchEffect } from 'vue';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import BaseEmpty from '@/components/ui/BaseEmpty.vue';

const route = useRoute();
const $can = useCan();

const isCreate = ref(false);
const isModalOpen = ref(false);
const driver = ref<Driver>();
const isLoading = ref(false);

const leadId = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const fetchDriver = async () => {
  if (!leadId.value) return;
  isLoading.value = true;
  try {
    driver.value = await DriverServiceInstance.getLeadDriver(leadId.value);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

watchEffect(() => {
  if (leadId.value) fetchDriver();
});

const openModal = () => {
  isModalOpen.value = true;
};
</script>

<template>
  <a-spin :spinning="isLoading">
    <div class="bg-white rounded-2xl p-3 min-h-[100px]">
      <article>
        <div class="flex justify-between items-center gap-1 pb-3 mb-2 border-b border-gray-100">
          <h2 class="text-gray-700 font-bold">Driver</h2>
          <button
            v-if="isCreate && $can(PermissionEnum.ADD_DRIVER)"
            class="flex items-center gap-1 text-primary-600 font-bold"
            type="button"
            @click="openModal"
          >
            <Icon :icon="Icons.PLUS" class="flex-shrink-0" />
            <span class="font-bold">Add</span>
          </button>
          <button
            v-else-if="!isCreate && $can(PermissionEnum.UPDATE_DRIVER)"
            class="flex items-center gap-1 text-primary-600 font-bold"
            type="button"
            @click="openModal"
          >
            <Icon :icon="Icons.EDIT" class="flex-shrink-0" />
            <span class="font-bold">Edit</span>
          </button>
        </div>

        <div v-if="driver && driver.fullName" class="flex flex-col gap-2">
          <div class="flex items-start gap-1">
            <Icon :icon="Icons.USER" class="flex-shrink-0 text-gray-400 mt-1" />
            <div class="flex flex-col">
              <span class="font-bold text-gray-700">{{ driver.fullName }}</span>
              <span v-if="driver?.phone" class="text-gray-400 font-medium text-xs">
                {{ formatPhoneNumber(driver.phone) }}
              </span>
            </div>
          </div>
          <div class="flex items-start gap-1">
            <Icon :icon="Icons.BUILDING2" class="flex-shrink-0 text-gray-400 mt-1" />
            <div class="flex flex-col">
              <span class="font-bold text-gray-700">{{ driver.companyName }}</span>
              <span class="text-gray-500 font-medium text-xs">{{ loadBoardTextMap[driver.loadBoard] }}</span>
            </div>
          </div>
        </div>
        <BaseEmpty
          v-else
          description="There is no driver assigned to this lead"
        />

        <ChatDriverFormModal
          :driver="driver"
          :open="isModalOpen"
          @handleClose="isModalOpen = false"
          @update-data="fetchDriver"
        />
      </article>
    </div>
  </a-spin>
</template>
