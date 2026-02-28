<script lang="ts" setup>
interface BaseTransitionProps {
  name: string
}

withDefaults(defineProps<BaseTransitionProps>(), {
  name: 'v',
});
</script>

<template>
  <transition :name="name">
    <slot />
  </transition>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
