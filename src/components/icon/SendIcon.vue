<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_117_1450)">
      <path
        d="M14.6666 1.33333L7.33325 8.66666M14.6666 1.33333L9.99992 14.6667L7.33325 8.66666M14.6666 1.33333L1.33325 5.99999L7.33325 8.66666"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.4" />
    </g>
    <defs>
      <clipPath id="clip0_117_1450">
        <rect fill="currentColor" height="16" width="16" />
      </clipPath>
    </defs>
  </svg>
</template>

<style lang="scss" scoped>

</style>
