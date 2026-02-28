<script lang="ts" setup>
import { RouterLink } from 'vue-router';

  interface IBreadcrumb {
    text: string;
    path?: string;
  }

  interface Props {
    breadcrumbs: IBreadcrumb[];
  }

defineProps<Props>();
</script>

<template>
  <a-breadcrumb class="mb-4 mx-1">
    <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      <a-breadcrumb-item v-if="breadcrumb.path">
        <router-link :to="breadcrumb.path">{{breadcrumb.text}}</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item v-else>{{breadcrumb.text}}</a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>
