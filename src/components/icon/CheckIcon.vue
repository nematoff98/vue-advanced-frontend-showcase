<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 4L5.99996 11.3333L2.66663 8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
