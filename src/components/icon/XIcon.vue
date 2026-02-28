<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.72598 2.27417L2.27441 9.72574M2.27441 2.27417L9.72598 9.72574" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
