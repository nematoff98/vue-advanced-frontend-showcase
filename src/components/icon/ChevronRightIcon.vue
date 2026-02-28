<script lang="ts" setup>
interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 11.5L6.5 6.5L1.5 1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
