<script lang="ts" setup>
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { FullLeadInfo, LeadServiceInstance, UpdateLeadActionsForm } from '@/services/lead';
import { ref } from 'vue';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';

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

const updateLeadSpecificDetails = async (params: UpdateLeadActionsForm) => {
  isLoading.value = true;
  try {
    await LeadServiceInstance.updateLead(props.lead.id, params);
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
      :class="{ 'text-green-600': lead.userAgree, 'text-red-600': !lead.userAgree }"
      class="flex items-center justify-center bg-gray-50 gap-2 "
      type="ghost"
      :loading="isLoading"
      @click.prevent
    >
      <Icon v-if="lead.userAgree !== null" :icon="lead.userAgree ? Icons.USER_CHECK : Icons.USER_X" />
      <span v-if="lead.userAgree === null" class="text-gray-900">Client interest status</span>
      <span v-else>{{ lead.userAgree ? 'Agree' : "Disagree" }}</span>
    </a-button>
    <template v-if="$can(PermissionEnum.UPDATE_LEAD)" #overlay>
      <a-menu>
        <a-menu-item
          v-if="!lead.userAgree"
          @click="updateLeadSpecificDetails({ userAgree: true })"
        >
          <div
            class="flex items-center justify-center gap-2 text-green-600"
          >
            <Icon :icon="Icons.USER_CHECK" />
            Agree
          </div>
        </a-menu-item>
        <a-menu-item
          v-if="lead.userAgree || lead.userAgree === null"
          @click="updateLeadSpecificDetails({ userAgree: false })"
        >
          <div
            class="flex items-center justify-center gap-2 text-red-600"
          >
            <Icon :icon="lead.userAgree ? Icons.USER_X : Icons.USER_CHECK" />
            Disagree
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style lang="scss" scoped>

</style>
