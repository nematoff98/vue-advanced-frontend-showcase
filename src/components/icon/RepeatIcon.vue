<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.5 0.5L10.5 2.5M10.5 2.5L8.5 4.5M10.5 2.5H3.5C2.96957 2.5 2.46086 2.71071 2.08579 3.08579C1.71071 3.46086 1.5 3.96957 1.5 4.5V5.5M3.5 11.5L1.5 9.5M1.5 9.5L3.5 7.5M1.5 9.5H8.5C9.03043 9.5 9.53914 9.28929 9.91421 8.91421C10.2893 8.53914 10.5 8.03043 10.5 7.5V6.5"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
