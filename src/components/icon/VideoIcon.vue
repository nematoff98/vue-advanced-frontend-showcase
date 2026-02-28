<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.3334 2.66671L10.6667 6.00004L15.3334 9.33337V2.66671Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" />
    <path
      d="M9.33335 1.33337H2.00002C1.26364 1.33337 0.666687 1.93033 0.666687 2.66671V9.33337C0.666687 10.0698 1.26364 10.6667 2.00002 10.6667H9.33335C10.0697 10.6667 10.6667 10.0698 10.6667 9.33337V2.66671C10.6667 1.93033 10.0697 1.33337 9.33335 1.33337Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
