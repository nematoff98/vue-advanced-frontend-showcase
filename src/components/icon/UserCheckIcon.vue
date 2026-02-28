<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 17 16" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1008_17279)">
      <path
        d="M11.1667 14V12.6667C11.1667 11.9594 10.8858 11.2811 10.3857 10.781C9.8856 10.281 9.20733 10 8.50008 10H3.83341C3.12617 10 2.44789 10.281 1.9478 10.781C1.4477 11.2811 1.16675 11.9594 1.16675 12.6667V14M11.8334 7.33333L13.1667 8.66667L15.8334 6M8.83341 4.66667C8.83341 6.13943 7.63951 7.33333 6.16675 7.33333C4.69399 7.33333 3.50008 6.13943 3.50008 4.66667C3.50008 3.19391 4.69399 2 6.16675 2C7.63951 2 8.83341 3.19391 8.83341 4.66667Z"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.4" />
    </g>
    <defs>
      <clipPath id="clip0_1008_17279">
        <rect fill="currentColor" height="16" transform="translate(0.5)" width="16" />
      </clipPath>
    </defs>
  </svg>

</template>

<style lang="scss" scoped>

</style>
