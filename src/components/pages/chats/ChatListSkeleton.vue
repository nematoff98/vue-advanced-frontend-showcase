<script setup lang="ts">

</script>

<template>
  <div class="chat-list-skeleton flex flex-col gap-2">
    <a-skeleton-button
      v-for="i in 10"
      :key="i"
      size="large"
      :block="true"
    />
  </div>
</template>

<style lang="scss">
.chat-list-skeleton {
  .ant-skeleton-button {
    height: 103px!important;
    border-radius: 4px!important;
  }
}
</style>
