<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_2122_112539)">
      <path
        d="M8.00065 4.00016V8.00016L10.6673 9.3335M14.6673 8.00016C14.6673 11.6821 11.6825 14.6668 8.00065 14.6668C4.31875 14.6668 1.33398 11.6821 1.33398 8.00016C1.33398 4.31826 4.31875 1.3335 8.00065 1.3335C11.6825 1.3335 14.6673 4.31826 14.6673 8.00016Z"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.4" />
    </g>
    <defs>
      <clipPath id="clip0_2122_112539">
        <rect fill="white" height="16" width="16" />
      </clipPath>
    </defs>
  </svg>

</template>

<style lang="scss" scoped>

</style>
