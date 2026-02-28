<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 12.8332H13M10 1.83316C10.2652 1.56794 10.6249 1.41895 11 1.41895C11.1857 1.41895 11.3696 1.45553 11.5412 1.5266C11.7128 1.59767 11.8687 1.70184 12 1.83316C12.1313 1.96448 12.2355 2.12038 12.3066 2.29196C12.3776 2.46354 12.4142 2.64744 12.4142 2.83316C12.4142 3.01888 12.3776 3.20277 12.3066 3.37436C12.2355 3.54594 12.1313 3.70184 12 3.83316L3.66667 12.1665L1 12.8332L1.66667 10.1665L10 1.83316Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.4" />
  </svg>
</template>

<style lang="scss" scoped>

</style>
