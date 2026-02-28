<script setup lang="ts">
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';

interface ChatItemContentFormTemplateEmits {
  (e: 'generate-ai-message'): void
}

interface ChatItemContentFormTemplateProps {
  loading: boolean
}

defineEmits<ChatItemContentFormTemplateEmits>();
defineProps<ChatItemContentFormTemplateProps>();
</script>

<template>
  <a-button
    :bordered="false"
    class="w-8 h-8 max-minMobile:h-7 max-minMobile:w-7 p-0 flex items-center justify-center bg-primary-50 border-none mr-2 text-primary dark:bg-primary-500/25"
    @click="$emit('generate-ai-message')"
    :loading="loading"
  >
    <Icon v-if="!loading" :icon="Icons.AI_STARS" />
  </a-button>
</template>

<style scoped lang="scss">

</style>
