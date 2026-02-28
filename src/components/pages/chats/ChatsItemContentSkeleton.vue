<script setup lang="ts">

</script>

<template>
  <div class="space-y-4 flex-1 overflow-hidden">
    <div class="flex items-end space-x-2" v-for="n in 3" :key="'left-' + n">
      <a-skeleton-avatar shape="circle" :size="40" active />
      <div>
        <a-skeleton
          active
          :paragraph="{ rows: 2, width: ['400px', '150px'] }"
          title="false"
        />
      </div>
    </div>

    <div class="flex justify-end">
      <div class="text-right">
        <a-skeleton
          active
          :paragraph="{ rows: 1, width: '280px' }"
          title="false"
        />
      </div>
      <a-skeleton-avatar shape="circle" :size="40" active />
    </div>

    <div class="flex justify-end">
      <div class="mr-2 text-right">
        <a-skeleton
          active
          :paragraph="{ rows: 2, width: ['240px', '100px'] }"
          title="false"
        />
      </div>
      <a-skeleton-avatar shape="circle" :size="40" active />
    </div>

    <div class="flex">
      <a-skeleton-avatar shape="circle" :size="40" active />
      <div class="ml-2">
        <a-skeleton
          active
          :paragraph="{ rows: 1, width: ['280px'] }"
          title="false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
