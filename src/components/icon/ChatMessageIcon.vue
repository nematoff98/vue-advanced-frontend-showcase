<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.6667 7.33333H6.66667M13.3333 10H6.66667M16 12C16 12.3536 15.8595 12.6928 15.6095 12.9428C15.3594 13.1929 15.0203 13.3333 14.6667 13.3333H6.66667L4 16V5.33333C4 4.97971 4.14048 4.64057 4.39052 4.39052C4.64057 4.14048 4.97971 4 5.33333 4H14.6667C15.0203 4 15.3594 4.14048 15.6095 4.39052C15.8595 4.64057 16 4.97971 16 5.33333V12Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
