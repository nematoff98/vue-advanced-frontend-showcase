<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 4 13" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.00004 7.1665C2.36823 7.1665 2.66671 6.86803 2.66671 6.49984C2.66671 6.13165 2.36823 5.83317 2.00004 5.83317C1.63185 5.83317 1.33337 6.13165 1.33337 6.49984C1.33337 6.86803 1.63185 7.1665 2.00004 7.1665Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
    <path
      d="M2.00004 2.49984C2.36823 2.49984 2.66671 2.20136 2.66671 1.83317C2.66671 1.46498 2.36823 1.1665 2.00004 1.1665C1.63185 1.1665 1.33337 1.46498 1.33337 1.83317C1.33337 2.20136 1.63185 2.49984 2.00004 2.49984Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
    <path
      d="M2.00004 11.8332C2.36823 11.8332 2.66671 11.5347 2.66671 11.1665C2.66671 10.7983 2.36823 10.4998 2.00004 10.4998C1.63185 10.4998 1.33337 10.7983 1.33337 11.1665C1.33337 11.5347 1.63185 11.8332 2.00004 11.8332Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
