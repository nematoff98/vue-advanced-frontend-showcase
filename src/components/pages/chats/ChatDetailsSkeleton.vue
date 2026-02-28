<script setup lang="ts">

</script>

<template>
  <div class="chat-details-skeleton space-y-4 flex-1 overflow-y-auto mt-3">
    <div class="flex items-end space-x-2" v-for="n in 3" :key="'left-' + n">
      <a-skeleton
        active
        :paragraph="{ rows: 2, width: ['100%', '100%'] }"
        :title="false"
      />
    </div>
  </div>
</template>

<style lang="scss">
.chat-details-skeleton {
  .ant-skeleton-paragraph {
    li {
      height: 150px!important;
    }
  }
}
</style>
