<script setup lang="ts">
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';

interface ChatItemContentFormTemplateEmits {
  (e: 'click'): void
}

defineEmits<ChatItemContentFormTemplateEmits>();
</script>

<template>
  <div
    class="w-8 h-8 max-minMobile:h-7 max-minMobile:w-7 rounded-lg bg-gray-50 flex items-center justify-center mr-2 cursor-pointer"
    @click="$emit('click')"
  >
    <Icon :icon="Icons.CLIPBOARD" class="text-gray-600" />
  </div>
</template>

<style scoped lang="scss">

</style>
