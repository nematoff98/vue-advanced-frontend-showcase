<script lang="ts" setup>
interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1716_119132)">
      <path
        d="M8.00004 5.33301V7.99967M8.00004 10.6663H8.00671M14.6667 7.99967C14.6667 11.6816 11.6819 14.6663 8.00004 14.6663C4.31814 14.6663 1.33337 11.6816 1.33337 7.99967C1.33337 4.31778 4.31814 1.33301 8.00004 1.33301C11.6819 1.33301 14.6667 4.31778 14.6667 7.99967Z"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.4" />
    </g>
    <defs>
      <clipPath id="clip0_1716_119132">
        <rect fill="white" height="16" width="16" />
      </clipPath>
    </defs>
  </svg>

</template>

<style lang="scss" scoped>

</style>
