<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router';
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { computed, ref } from 'vue';
import { CopyableTextType } from './helpers';

interface CopyableTextProps {
  text?: string | number,
  value?: string | number,
  type?: CopyableTextType,
  internalLinkData?: RouteLocationRaw,
  textClass?: string,
  iconClass?: string,
}

const props = withDefaults(
  defineProps<CopyableTextProps>(),
  {
    type: CopyableTextType.REGULAR,
    textClass: 'text-xs text-gray-500 font-medium',
    iconClass: 'ml-1 text-gray-400',
  },
);

const copyIcon = ref<Icons>(Icons.COPY);
const tooltipText = ref<string>('Click to Copy');

const preparedLink = computed(() => (
  props.text && props.text.toString().indexOf('http') >= 0
    ? props.text.toString()
    : `${props.value?.toString()}`
));

const copyToClipboard = () => {
  if (!props.text && props.value === undefined) return;

  const valueForCopy = props.value !== undefined ? props.value.toString() : props.text?.toString();

  navigator.clipboard.writeText(valueForCopy || '');

  copyIcon.value = Icons.CHECK;
  tooltipText.value = 'Copied!';
  setTimeout(() => {
    copyIcon.value = Icons.COPY;
    tooltipText.value = 'Click to Copy';
  }, 5000);
};
</script>

<template>
  <a-space :size="8">
    <a
      v-if="type === CopyableTextType.EXTERNAL_LINK && !!text"
      :class="textClass"
      target="_blank"
      rel="noopener noreferrer"
      :href="preparedLink"
    >
      {{ text.toString() }}
    </a>
    <p v-else :class="textClass">{{ text }}</p>
    <a-tooltip v-if="!!text" :title="tooltipText">
      <Icon v-if="text" :icon="copyIcon" class="cursor-pointer" :class="iconClass" @click="copyToClipboard" />
    </a-tooltip>
  </a-space>
</template>

<style lang="scss" scoped>
.Copyable {
  &_Icon {
    cursor: pointer;
  }
}
</style>
