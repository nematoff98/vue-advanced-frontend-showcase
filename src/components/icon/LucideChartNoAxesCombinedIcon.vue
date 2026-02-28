<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.0001 13.3333V17.5M13.3334 11.6667V17.5M16.6667 8.33333V17.5M18.3334 2.5L11.1284 9.705C11.0897 9.7438 11.0437 9.77459 10.9931 9.79559C10.9425 9.8166 10.8882 9.82741 10.8334 9.82741C10.7786 9.82741 10.7243 9.8166 10.6737 9.79559C10.6231 9.77459 10.5771 9.7438 10.5384 9.705L7.79508 6.96167C7.71694 6.88355 7.61098 6.83967 7.5005 6.83967C7.39001 6.83967 7.28405 6.88355 7.20591 6.96167L1.66675 12.5M3.33341 15V17.5M6.66675 11.6667V17.5"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="0.75"
      stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
