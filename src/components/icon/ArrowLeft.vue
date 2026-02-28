<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.6667 8.00001H3.33337M3.33337 8.00001L8.00004 12.6667M3.33337 8.00001L8.00004 3.33334" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
