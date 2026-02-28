<script setup lang="ts">
interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66667 9.33333H6.66667M6.66667 9.33333V13.3333M6.66667 9.33333L2 14M13.3333 6.66667H9.33333M9.33333 6.66667V2.66667M9.33333 6.66667L14 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<style scoped lang="scss">

</style>
