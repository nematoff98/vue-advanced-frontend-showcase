<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.33333 2.5H2.5V8.33333H8.33333V2.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.75" stroke-width="1.4" />
    <path d="M17.5 2.5H11.6667V8.33333H17.5V2.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.75" stroke-width="1.4" />
    <path d="M17.5 11.6667H11.6667V17.5H17.5V11.6667Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.75" stroke-width="1.4" />
    <path d="M8.33333 11.6667H2.5V17.5H8.33333V11.6667Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.75" stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
