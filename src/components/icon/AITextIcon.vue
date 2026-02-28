<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 12 11" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.0182813 11L3.39228 0.92H5.12828L8.50228 11H7.20728L4.05028 1.648H4.44228L1.31328 11H0.0182813ZM1.64228 8.641V7.472H6.87828V8.641H1.64228ZM9.89539 11V0.92H11.1414V11H9.89539Z" fill="currentColor" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
