<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.6667 7.99999H10.6667L9.33337 9.99999H6.66671L5.33337 7.99999H1.33337M14.6667 7.99999V12C14.6667 12.3536 14.5262 12.6928 14.2762 12.9428C14.0261 13.1928 13.687 13.3333 13.3334 13.3333H2.66671C2.31309 13.3333 1.97395 13.1928 1.7239 12.9428C1.47385 12.6928 1.33337 12.3536 1.33337 12V7.99999M14.6667 7.99999L12.3667 3.40666C12.2563 3.18451 12.0862 2.99757 11.8753 2.86684C11.6645 2.73612 11.4214 2.66679 11.1734 2.66666H4.82671C4.57865 2.66679 4.33555 2.73612 4.12474 2.86684C3.91392 2.99757 3.74376 3.18451 3.63337 3.40666L1.33337 7.99999"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
