<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.75008 4.83317L0.666748 2.74984M0.666748 2.74984L2.75008 0.666504M0.666748 2.74984H5.66675C6.10878 2.74984 6.5327 2.92543 6.84526 3.23799C7.15782 3.55055 7.33342 3.97448 7.33342 4.4165V7.33317"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.2" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
