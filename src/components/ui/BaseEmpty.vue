<script setup lang="ts">
import { Empty } from 'ant-design-vue';

interface BaseEmptyProps {
  description?: string
}

defineProps<BaseEmptyProps>();
</script>

<template>
  <a-empty
    :description="description"
    :image="Empty.PRESENTED_IMAGE_SIMPLE"
  />
</template>
