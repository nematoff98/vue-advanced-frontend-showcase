<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1621_55382)">
      <path
        d="M0.666504 6.66669H15.3332M1.99984 2.66669H13.9998C14.7362 2.66669 15.3332 3.26364 15.3332 4.00002V12C15.3332 12.7364 14.7362 13.3334 13.9998 13.3334H1.99984C1.26346 13.3334 0.666504 12.7364 0.666504 12V4.00002C0.666504 3.26364 1.26346 2.66669 1.99984 2.66669Z"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.4" />
    </g>
    <defs>
      <clipPath id="clip0_1621_55382">
        <rect fill="white" height="16" width="16" />
      </clipPath>
    </defs>
  </svg>

</template>

<style lang="scss" scoped>

</style>
