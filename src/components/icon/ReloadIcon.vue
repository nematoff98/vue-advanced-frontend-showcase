<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.1672 2.33318V7.33318M18.1672 7.33318H13.1672M18.1672 7.33318L14.3089 3.69985C13.1594 2.54963 11.6672 1.80417 10.0572 1.5758C8.44716 1.34743 6.80653 1.64853 5.38251 2.43371C3.9585 3.2189 2.82826 4.44564 2.1621 5.92907C1.49595 7.41251 1.32997 9.07226 1.68919 10.6582C2.0484 12.2442 2.91335 13.6705 4.15368 14.7221C5.39401 15.7737 6.94254 16.3937 8.5659 16.4887C10.1893 16.5836 11.7995 16.1484 13.154 15.2486C14.5085 14.3488 15.5339 13.0331 16.0756 11.4998"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>

</template>

<style lang="scss" scoped>

</style>
