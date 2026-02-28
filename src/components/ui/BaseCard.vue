<template>
  <div
    class="base-card"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.base-card {
  background-color: var(--color-white-100);
  border-radius: 16px;
}

.dark .base-card {
  background-color: var(--color-gray-800);
}
</style>
