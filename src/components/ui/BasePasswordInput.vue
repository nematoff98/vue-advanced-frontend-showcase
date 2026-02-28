<script lang="ts" setup>
import { Field } from 'vee-validate';
import {
  computed, ref, type Slots, useSlots,
} from 'vue';
import { v4 as uuidv4 } from 'uuid';

interface BasePasswordInputProps {
  name: string;
  rules?: string | Record<string, unknown>;
  label: string;
  component?: string;
  type?: string;
  placeholder?: string;
  modelValue?: string | null;
}

const props = defineProps<BasePasswordInputProps>();

const inputValue = ref('');

const emits = defineEmits(['update:modelValue']);
const slots: Slots = useSlots();

const uniqueId = computed(() => `${props.name}-${uuidv4()}`);
const isInputRequired = computed(() => {
  if (!props.rules) return false;
  if (typeof props.rules === 'string') return props.rules.includes('required');
  return props.rules.required;
});

const input = () => {
  emits('update:modelValue', inputValue.value);
};
</script>

<template>
  <Field
    v-slot="{ errorMessage }"
    :label="label"
    :model-value="modelValue"
    :name="name"
    :rules="rules"
  >
    <label :for="uniqueId" class="block text-gray-700 font-medium text-sm mb-[6px]">
      {{ label }} <span v-if="isInputRequired" class="text-primary-600">*</span>
    </label>

    <a-input-password
      v-model:value="inputValue"
      :class="errorMessage ? 'ant-input-status-error' : ''"
      class="w-full"
      size="large"
      v-bind="{ type, placeholder, id: uniqueId }"
      @input="input"
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
    </a-input-password>
    <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
      {{ errorMessage }}
    </span>
  </Field>
</template>
