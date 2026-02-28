<script lang="ts" setup>
import { GlobalSearchLeadData } from '@/services/global-search';
import BaseLeadStatusBadge from '@/components/ui/BaseLeadStatusBadge.vue';
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { computed } from 'vue';
import { Routes } from '@/router/router.links';

const { CHATS } = Routes;

const props = defineProps<{ lead: GlobalSearchLeadData }>();

const name = computed(() => `${props.lead.firstName} ${props.lead.lastName}`);
</script>

<template>
  <router-link
    :to="`${CHATS.path}?leadId=${lead.id}&chatId=${lead.chatId}`"
    class="flex items-start gap-2"
  >
    <div>
      <a-avatar :src="lead.image" size="large" class="bg-primary-100 flex items-center justify-center">
        <template #icon>
          <Icon :icon="Icons.USER_FILLED" class="text-primary-400" size="28" />
        </template>
      </a-avatar>
    </div>
    <div class="flex flex-col gap-0.5 flex-grow overflow-hidden">
      <p class="font-bold text-gray-700 text-sm truncate">{{ name }}</p>
      <p class="font-medium text-gray-600 text-sm">{{ lead.phone }}</p>
      <p class="font-medium text-gray-500 text-xs">{{ lead.email }}</p>
    </div>
    <div class="flex-shrink-0">
      <p class="text-gray-600 font-bold text-sm mb-1 text-end">#{{ lead?.leadNumber }}</p>
      <BaseLeadStatusBadge :status="lead.status" class="ms-auto" />
    </div>
  </router-link>
</template>

<style lang="scss" scoped>

</style>
