<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 10 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4.26795C10.3333 5.03775 10.3333 6.96225 9 7.73205L3 11.1962C1.66667 11.966 0 11.0037 0 9.4641V2.5359C0 0.996296 1.66667 0.0340474 3 0.803848L9 4.26795Z" fill="currentColor" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
