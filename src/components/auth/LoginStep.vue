<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';

interface LoginStepProps {
  step: number
  disabled?: boolean
  loading?: boolean
}

defineProps<LoginStepProps>();

const items = [1, 2, 3];
</script>

<template>
  <BaseCard class="px-[16px] md:px-[50px] py-10 w-[550px] max-w-full">
    <Icon :icon="Icons.SHIELD_CHECK_FULL" class="text-primary mx-auto mb-4" size="38" />
    <h2 class="text-2xl text-gray-700 text-center font-bold mb-4">Two-Factor Authentication Setup</h2>
    <a-steps :responsive="false" :current="step" :items="items" class="mb-4" />
    <slot />
  </BaseCard>
</template>
