<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.9999 4L4.66659 11.3333L1.33325 8M14.6666 6.66667L9.66658 11.6667L8.66658 10.6667" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
