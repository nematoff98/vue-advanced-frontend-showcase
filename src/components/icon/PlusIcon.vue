<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1V13M1 7H13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
