<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 14 16" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 4H2.33333M2.33333 4H13M2.33333 4V13.3333C2.33333 13.687 2.47381 14.0261 2.72386 14.2761C2.97391 14.5262 3.31304 14.6667 3.66667 14.6667H10.3333C10.687 14.6667 11.0261 14.5262 11.2761 14.2761C11.5262 14.0261 11.6667 13.687 11.6667 13.3333V4H2.33333ZM4.33333 4V2.66667C4.33333 2.31304 4.47381 1.97391 4.72386 1.72386C4.97391 1.47381 5.31304 1.33333 5.66667 1.33333H8.33333C8.68696 1.33333 9.02609 1.47381 9.27614 1.72386C9.52619 1.97391 9.66667 2.31304 9.66667 2.66667V4M5.66667 7.33333V11.3333M8.33333 7.33333V11.3333"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
