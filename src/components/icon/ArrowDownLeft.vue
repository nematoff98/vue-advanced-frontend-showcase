<script setup lang="ts">
interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 4.66666L4.66663 11.3333M4.66663 11.3333H11.3333M4.66663 11.3333V4.66666" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<style scoped lang="scss">

</style>
