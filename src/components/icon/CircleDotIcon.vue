<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <rect height="11.4" rx="5.7" stroke="currentColor" stroke-width="0.6" width="11.4" x="0.3" y="0.3" />
    <circle cx="6" cy="6" fill="currentColor" r="2.7" stroke="currentColor" stroke-width="0.6" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
