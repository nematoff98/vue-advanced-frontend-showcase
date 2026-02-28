<script setup lang="ts">
import { Field } from 'vee-validate';
import { vMaska } from 'maska/vue';
import { computed, Slots, useSlots } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

interface BaseInputProps {
  name: string;
  rules?: string | Record<string, unknown>;
  label?: string;
  component?: string;
  loading?: boolean;
  insideLoading?: boolean;
  type?: string;
  placeholder?: string;
  modelValue?: string | number | null;
  removeLabel?: boolean;
  mask?: string;
  disabled?: boolean;
  allowClear?: boolean;
  size?: 'large' | 'middle' | 'small'
}

interface BaseInputEmits {
  (e: 'update:modelValue', value?: string | number): void
}

const props = defineProps<BaseInputProps>();
const emits = defineEmits<BaseInputEmits>();

const uniqueId = `${props.name}-${uuidv4()}`;
const isInputRequired = computed(() => {
  if (!props.rules) return false;
  if (typeof props.rules === 'string') return props.rules.includes('required');
  return props.rules.required;
});

const slots: Slots = useSlots();

const handleInputUpdate = (value?: number | string) => {
  emits('update:modelValue', value);
};

</script>

<template>
  <div>
    <Field
      :name="name"
      v-slot="{ errorMessage }"
      :model-value="modelValue"
      :label="label"
      :rules="rules"
    >
      <label v-if="label && !removeLabel" :for="uniqueId" class="block text-gray-700 font-medium text-sm mb-[6px]">
        {{ label }} <span v-if="isInputRequired" class="text-primary-600">*</span>
      </label>

      <a-input
        class="w-full"
        v-bind="$attrs"
        :allow-clear="allowClear"
        :id="uniqueId"
        :type="type"
        :disabled="disabled"
        :placeholder="placeholder"
        :value="modelValue"
        @update:value="handleInputUpdate"
        :loading="loading"
        v-maska="mask"
        :size="size || 'large'"
        :class="errorMessage ? 'ant-input-status-error' : ''"
      >
        <template v-if="slots.prefix" #prefix>
          <slot name="prefix" />
        </template>
        <template v-if="slots.suffix || insideLoading" #suffix>
          <LoadingSpinner v-if="insideLoading" />
          <slot name="suffix" />
        </template>
        <template v-if="slots.addonBefore" #addonBefore>
          <slot name="addonBefore" />
        </template>
        <template v-if="slots.addonAfter || loading" #addonAfter>
          <a-spin v-if="loading" />
          <slot name="addonAfter" />
        </template>
      </a-input>
      <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
        {{ errorMessage }}
      </span>
    </Field>
  </div>
</template>
