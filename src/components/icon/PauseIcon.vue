<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg id="Pause" :height="size" :width="size" viewBox="0 0 48 48" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
    <path
      class="color000000 svgShape"
      d="M36 39h-6c-1.659 0-3-1.341-3-3V12c0-1.659 1.341-3 3-3h6c1.659 0 3 1.341 3 3v24c0 1.659-1.341 3-3 3zm-18 0h-6c-1.659 0-3-1.341-3-3V12c0-1.659 1.341-3 3-3h6c1.659 0 3 1.341 3 3v24c0 1.659-1.341 3-3 3z"
      fill="currentColor" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
