<script setup lang="ts">
import { Field } from 'vee-validate';
import {
  computed, onMounted, onUpdated, ref, type Slots, useSlots,
} from 'vue';
import { v4 as uuidv4 } from 'uuid';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';

interface BaseInputProps {
  name: string;
  rules?: string | Record<string, unknown>;
  label: string;
  component?: string;
  type?: string;
  placeholder?: string;
  height?: number | string;
  modelValue?: string | number | null;
  tooltip?: string;
}

const props = defineProps<BaseInputProps>();

const inputValue = ref('');

const emits = defineEmits(['update:modelValue']);
const slots: Slots = useSlots();

const uniqueId = computed(() => `${props.name}-${uuidv4()}`);
const isInputRequired = computed(() => {
  if (!props.rules) return false;
  if (typeof props.rules === 'string') return props.rules.includes('required');
  return props.rules.required;
});

const style = computed(() => {
  const styles = [];
  if (props.height) {
    styles.push(`height: ${props.height}px!important;`);
  }
  return styles.join(';');
});

const input = () => {
  emits('update:modelValue', inputValue.value);
};

onMounted(() => {
  inputValue.value = props.modelValue?.toString() || '';
});

onUpdated(() => {
  inputValue.value = props.modelValue?.toString() || '';
});
</script>

<template>
  <Field
    :name="name"
    v-slot="{ errorMessage }"
    :model-value="modelValue"
    :label="label"
    :rules="rules"
  >
    <a-tooltip v-if="label">
      <template v-if="tooltip" #title>{{ tooltip }}</template>
      <label :for="uniqueId" class="text-gray-700 w-fit flex items-center gap-1 font-medium text-sm mb-[6px]">
        {{ label }} <span v-if="isInputRequired" class="text-primary-600">*</span> <Icon :icon="Icons.INFO" />
      </label>
    </a-tooltip>

    <a-textarea
      v-bind="$attrs"
      :id="uniqueId"
      v-model:value="inputValue"
      @input="input"
      size="large"
      :placeholder="placeholder"
      class="w-full"
      :class="[errorMessage ? 'ant-input-status-error' : '']"
      :style="style"
    >
      <template v-if="slots.prefix" #prefix>
        <slot name="prefix" />
      </template>

      <template v-if="slots.suffix" #suffix>
        <slot name="suffix" />
      </template>

      <template v-if="slots.addonBefore" #addonBefore>
        <slot name="addonBefore" />
      </template>

      <template v-if="slots.addonAfter" #addonAfter>
        <slot name="addonAfter" />
      </template>
    </a-textarea>
    <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
      {{ errorMessage }}
    </span>
  </Field>
</template>
