<script lang="ts" setup>
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { FullLeadInfo, LeadServiceInstance } from '@/services/lead';
import { TrailerType } from '@/services/lead-vehicle';
import { ref } from 'vue';
import { PermissionEnum } from '@/utils/permission/enums';
import { useCan } from '@/utils/permission/can';

const $can = useCan();

interface ChatLeadInfoProps {
  lead: FullLeadInfo
}

interface ChatLeadInfoEmits {
  (e: 'updateLead'): void
}

const props = defineProps<ChatLeadInfoProps>();
const emits = defineEmits<ChatLeadInfoEmits>();

const isLoading = ref(false);

const updateLeadSpecificDetails = async () => {
  isLoading.value = true;
  const type = props.lead.trailerType === TrailerType.OPEN ? TrailerType.ENCLOSED : TrailerType.OPEN;
  try {
    await LeadServiceInstance.updateLead(props.lead.id, { trailerType: type });
    emits('updateLead');
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <a-dropdown>
    <a-button
      v-if="lead"
      class="flex items-center justify-center bg-gray-50 gap-2 text-primary-600"
      type="ghost"
      :loading="isLoading"
    >
      <Icon :icon="lead.trailerType === TrailerType.ENCLOSED ? Icons.TRUCK : Icons.TRUCK_OPEN" />
      <span class="capitalize">{{ lead.trailerType }}</span>
    </a-button>
    <template v-if="$can(PermissionEnum.UPDATE_LEAD)" #overlay>
      <a-menu>
        <a-menu-item
          @click="updateLeadSpecificDetails"
        >
          <div
            class="flex items-center justify-center gap-2 text-primary-600"
          >
            <Icon :icon="lead.trailerType === TrailerType.ENCLOSED ? Icons.TRUCK_OPEN : Icons.TRUCK" />
            {{ lead.trailerType === TrailerType.ENCLOSED ? "Open" : 'Enclosed' }}
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style lang="scss" scoped>

</style>
