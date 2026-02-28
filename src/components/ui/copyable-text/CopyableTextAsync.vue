<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router';
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { ref } from 'vue';
import { CopyableTextType } from './helpers';

interface CopyableTextAsyncProps {
  text?: string | number,
  value: () => Promise<string | undefined> | string,
  type?: CopyableTextType,
  internalLinkData?: RouteLocationRaw,
  textClass?: string,
  iconClass?: string,
}

const props = withDefaults(
  defineProps<CopyableTextAsyncProps>(),
  {
    type: CopyableTextType.REGULAR,
    textClass: 'text-xs text-gray-500 font-medium',
    iconClass: 'ml-1 text-gray-400',
  },
);

const copyIcon = ref<Icons>(Icons.COPY);
const tooltipText = ref<string>('Click to Copy');
const isLoading = ref(false);

const fetchValue = async () => {
  if (typeof props.value === 'function') {
    isLoading.value = true;
    try {
      return await props.value();
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  return undefined;
};

const copyToClipboard = async () => {
  const value = await fetchValue();
  if (value === undefined) return;

  navigator.clipboard.writeText(value);

  copyIcon.value = Icons.CHECK;
  tooltipText.value = 'Copied!';
  setTimeout(() => {
    copyIcon.value = Icons.COPY;
    tooltipText.value = 'Click to Copy';
  }, 5000);
};
</script>

<template>
  <a-space v-if="type === CopyableTextType.REGULAR">
    <p :class="textClass">{{ text }}</p>
    <a-tooltip v-if="!!text" :title="tooltipText">
      <Icon v-if="text && !isLoading" :icon="copyIcon" class="cursor-pointer" :class="iconClass" @click="copyToClipboard" />
      <Icon v-if="isLoading" :icon="Icons.LOADING_OUTLINED" :class="iconClass" />
    </a-tooltip>
  </a-space>
</template>
