<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.33333 11.3333L4 7.99996L7.33333 4.66663M12 11.3333L8.66667 7.99996L12 4.66663" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
