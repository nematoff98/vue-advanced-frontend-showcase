<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.33329 12L0.666626 14.6666V3.99998L5.33329 1.33331M5.33329 12L10.6666 14.6666M5.33329 12V1.33331M10.6666 14.6666L15.3333 12V1.33331L10.6666 3.99998M10.6666 14.6666V3.99998M10.6666 3.99998L5.33329 1.33331"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
