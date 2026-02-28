<script setup lang="ts">
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
</script>

<template>
  <a-spin>
    <template #indicator>
      <Icon :icon="Icons.LOADING_OUTLINED" />
    </template>
  </a-spin>
</template>
