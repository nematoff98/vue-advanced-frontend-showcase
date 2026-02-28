<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8Z" fill="currentColor" />
    <path d="M6 1.5V2V1.5Z" fill="currentColor" />
    <path d="M6 10V10.5V10Z" fill="currentColor" />
    <path d="M1.5 6H2H1.5Z" fill="currentColor" />
    <path d="M10 6H10.5H10Z" fill="currentColor" />
    <path d="M9.182 2.818L8.8285 3.1715L9.182 2.818Z" fill="currentColor" />
    <path d="M3.1715 8.8285L2.818 9.182L3.1715 8.8285Z" fill="currentColor" />
    <path d="M2.818 2.818L3.1715 3.1715L2.818 2.818Z" fill="currentColor" />
    <path d="M8.8285 8.8285L9.182 9.182L8.8285 8.8285Z" fill="currentColor" />
    <path
      d="M6 1.5V2M6 10V10.5M1.5 6H2M10 6H10.5M9.182 2.818L8.8285 3.1715M3.1715 8.8285L2.818 9.182M2.818 2.818L3.1715 3.1715M8.8285 8.8285L9.182 9.182M8 6C8 7.10457 7.10457 8 6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
