<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 14" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.6668 3.00033C14.6668 2.26699 14.0668 1.66699 13.3335 1.66699H2.66683C1.9335 1.66699 1.3335 2.26699 1.3335 3.00033M14.6668 3.00033V11.0003C14.6668 11.7337 14.0668 12.3337 13.3335 12.3337H2.66683C1.9335 12.3337 1.3335 11.7337 1.3335 11.0003V3.00033M14.6668 3.00033L8.00016 7.66699L1.3335 3.00033"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
