<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.6666 8H12L9.99998 14L5.99998 2L3.99998 8H1.33331" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
