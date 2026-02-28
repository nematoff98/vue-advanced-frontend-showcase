<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 17" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 11.1668V8.50016M8 5.8335H8.00667M14.6667 8.50016C14.6667 12.1821 11.6819 15.1668 8 15.1668C4.3181 15.1668 1.33334 12.1821 1.33334 8.50016C1.33334 4.81826 4.3181 1.8335 8 1.8335C11.6819 1.8335 14.6667 4.81826 14.6667 8.50016Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
