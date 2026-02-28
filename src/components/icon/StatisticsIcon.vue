<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.99984 12.3333V16.5M13.3332 10.6667V16.5M16.6665 7.33333V16.5M18.3332 1.5L11.1282 8.705C11.0895 8.7438 11.0435 8.77459 10.9929 8.79559C10.9422 8.8166 10.888 8.82741 10.8332 8.82741C10.7784 8.82741 10.7241 8.8166 10.6735 8.79559C10.6229 8.77459 10.5769 8.7438 10.5382 8.705L7.79484 5.96167C7.7167 5.88355 7.61074 5.83967 7.50025 5.83967C7.38977 5.83967 7.28381 5.88355 7.20567 5.96167L1.6665 11.5M3.33317 14V16.5M6.6665 10.6667V16.5"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-opacity="0.75"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
