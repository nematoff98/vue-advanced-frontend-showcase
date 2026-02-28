<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.5 4.58317H11.6667M8.33333 4.58317H2.5M17.5 9.99984H10M6.66667 9.99984H2.5M17.5 15.4165H13.3333M10 15.4165H2.5M11.6667 2.9165V6.24984M6.66667 8.33317V11.6665M13.3333 13.7498V17.0832"
      stroke="#4B5563"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
