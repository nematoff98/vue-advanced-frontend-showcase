<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.5 14.167L4.16667 15.8337L7.5 12.5003M10.8333 5.00033H17.5M10.8333 10.0003H17.5M10.8333 15.0003H17.5M3.33333 4.16699H6.66667C7.1269 4.16699 7.5 4.54009 7.5 5.00033V8.33366C7.5 8.7939 7.1269 9.16699 6.66667 9.16699H3.33333C2.8731 9.16699 2.5 8.7939 2.5 8.33366V5.00033C2.5 4.54009 2.8731 4.16699 3.33333 4.16699Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
