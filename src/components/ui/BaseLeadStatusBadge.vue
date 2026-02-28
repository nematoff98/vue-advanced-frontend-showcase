<script lang="ts" setup>
import { LeadStatus, leadStatusColorMap, leadStatusTextMap } from '@/services/lead';

defineProps<{ status: LeadStatus }>();
</script>
<template>
  <div :style="{ backgroundColor: leadStatusColorMap[status].bgColor, color: leadStatusColorMap[status].color }" class="lead-status-badge h-5 px-2 rounded-[50px] w-max flex items-center">
    <span class="text-xxs font-medium">{{ leadStatusTextMap[status] }}</span>
  </div>
</template>

<style lang="scss" scoped></style>
