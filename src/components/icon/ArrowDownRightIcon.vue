<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>

  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.66602 4.66602L11.3327 11.3327M11.3327 11.3327V4.66602M11.3327 11.3327H4.66602" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
