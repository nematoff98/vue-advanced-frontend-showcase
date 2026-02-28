<script setup lang="ts">
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
});
const emit = defineEmits(['update:modelValue']);

function toggle() {
  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <div
    @click="toggle"
    class="w-9 h-5 transition-all duration-300 flex items-center rounded-full p-1 bg-[#FFFFFF0D] hover:bg-[#FFFFFF1A]">
    <div
      :class="{ 'translate-x-[14px]': modelValue, 'translate-x-[-2px]': !modelValue }"
      class="w-4 h-4 transition-all duration-300 bg-primary-600 rounded-full flex items-center justify-center"
    >
      <Icon v-if="modelValue" :icon="Icons.SUN" :size="12" />
      <Icon v-else :icon="Icons.MOON" :size="12" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
