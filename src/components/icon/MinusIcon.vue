<script setup lang="ts">
interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33337 8H12.6667" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<style scoped lang="scss">

</style>
