<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 17" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.3335 14.5H10.6668M8.00016 11.8333V14.5M2.66683 2.5H13.3335C14.0699 2.5 14.6668 3.09695 14.6668 3.83333V10.5C14.6668 11.2364 14.0699 11.8333 13.3335 11.8333H2.66683C1.93045 11.8333 1.3335 11.2364 1.3335 10.5V3.83333C1.3335 3.09695 1.93045 2.5 2.66683 2.5Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
