<script setup lang="ts">
interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.66663 1.33334H3.99996C3.64634 1.33334 3.3072 1.47381 3.05715 1.72386C2.8071 1.97391 2.66663 2.31305 2.66663 2.66667V13.3333C2.66663 13.687 2.8071 14.0261 3.05715 14.2761C3.3072 14.5262 3.64634 14.6667 3.99996 14.6667H12C12.3536 14.6667 12.6927 14.5262 12.9428 14.2761C13.1928 14.0261 13.3333 13.687 13.3333 13.3333V6M8.66663 1.33334L13.3333 6M8.66663 1.33334V6H13.3333"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped lang="scss">

</style>
