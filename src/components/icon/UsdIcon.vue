<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 10 16" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 1.5V14.5M8.33333 3.33333H3.33333C2.7145 3.33333 2.121 3.57917 1.68342 4.01675C1.24583 4.45434 1 5.04783 1 5.66667C1 6.28551 1.24583 6.879 1.68342 7.31658C2.121 7.75417 2.7145 8 3.33333 8H6.66667C7.28551 8 7.879 8.24583 8.31658 8.68342C8.75417 9.121 9 9.7145 9 10.3333C9 10.9522 8.75417 11.5457 8.31658 11.9833C7.879 12.4208 7.28551 12.6667 6.66667 12.6667H1"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
