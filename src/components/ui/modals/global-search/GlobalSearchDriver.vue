<script lang="ts" setup>
import { GlobalSearchDriverData } from '@/services/global-search';
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { formatPhoneNumber } from '@/utils/format-phone';

defineProps<{ driver: GlobalSearchDriverData }>();
</script>

<template>
  <article class="flex items-start gap-2">
    <div>
      <a-avatar :src="driver.image" class="flex items-center justify-center bg-primary-100" size="large">
        <template #icon>
          <Icon :icon="Icons.USER_FILLED" :size="28" class="text-primary-400" />
        </template>
      </a-avatar>
    </div>
    <div v-if="driver" class="flex flex-col gap-0.5 flex-grow overflow-hidden">
      <p class="font-bold text-gray-700 text-sm truncate">{{ driver.fullName }}</p>
      <p class="font-medium text-gray-600 text-sm">{{ formatPhoneNumber(driver.phone) }}</p>
      <p class="font-bold text-gray-700 text-sm truncate">{{ driver.carrierName }}</p>
      <p class="font-medium text-gray-500 text-xs">{{ driver.organization }}</p>
    </div>
  </article>
</template>

<style lang="scss" scoped>

</style>
