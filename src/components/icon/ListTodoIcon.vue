<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.5 14.1666L4.16667 15.8333L7.5 12.5M10.8333 4.99996H17.5M10.8333 9.99996H17.5M10.8333 15H17.5M3.33333 4.16663H6.66667C7.1269 4.16663 7.5 4.53972 7.5 4.99996V8.33329C7.5 8.79353 7.1269 9.16663 6.66667 9.16663H3.33333C2.8731 9.16663 2.5 8.79353 2.5 8.33329V4.99996C2.5 4.53972 2.8731 4.16663 3.33333 4.16663Z"
      stroke="#4B5563"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
