<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.5 2.58317H10.6667M7.33333 2.58317H1.5M16.5 7.99984H9M5.66667 7.99984H1.5M16.5 13.4165H12.3333M9 13.4165H1.5M10.6667 0.916504V4.24984M5.66667 6.33317V9.6665M12.3333 11.7498V15.0832"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
