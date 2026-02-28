<script setup lang="ts">
import { Field } from 'vee-validate';
import { Slots, useSlots } from 'vue';
import { v4 as uuidv4 } from 'uuid';

interface BaseNumberInputProps {
  name: string;
  rules?: string;
  label?: string;
  component?: string;
  type?: string;
  loading?: boolean;
  placeholder?: string;
  modelValue?: string | number;
  removeLabel?: boolean;
}

interface BaseNumberInputEmits {
  (e: 'update:modelValue', value: number): void
}

const props = defineProps<BaseNumberInputProps>();
const emits = defineEmits<BaseNumberInputEmits>();

const slots: Slots = useSlots();

const uniqueId = `${props.name}-${uuidv4()}`;
</script>

<template>
  <Field
    :name="name"
    v-slot="{ errorMessage }"
    :model-value="modelValue"
    :label="label"
    :rules="rules"
  >
    <label v-if="label && !removeLabel" :for="uniqueId" class="block text-gray-700 font-medium text-sm mb-[6px]">
      {{ label }} <span v-if="rules === 'required'" class="text-primary-600">*</span>
    </label>

    <a-input-number
      v-bind="$attrs"
      :id="uniqueId"
      :placeholder="placeholder"
      :value="modelValue"
      @update:value="(val: number) => emits('update:modelValue', val)"
      size="large"
      class="w-full"
      :class="errorMessage ? 'ant-input-status-error' : ''"
    >
      <template v-if="slots.addonAfter || loading" #addonAfter>
        <a-spin v-if="loading" />
        <slot name="addonAfter" />
      </template>
    </a-input-number>
    <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
      {{ errorMessage }}
    </span>
  </Field>
</template>
