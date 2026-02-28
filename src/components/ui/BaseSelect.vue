<script generic="T" lang="ts" setup>
import { Field } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { SelectOption } from '@/services/general';

interface BaseSelectProps {
  name: string;
  showArrow?: boolean;
  rules?: string;
  label?: string;
  modelValue?: string | number | number[] | string[];
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  showSearch?: boolean;
  mode?: string;
  maxTagCount?: number;
  /** Pass false for remote search (no local filtering) */
  filterOption?: boolean | ((inputValue: string, option: SelectOption<T>) => boolean);
  allowClear?: boolean;
  loading?: boolean;
}

interface BaseSelectEmits {
  (e: 'update:modelValue', value: string | number): void;
  (e: 'search', value: string): void;
}

const props = defineProps<BaseSelectProps>();
const emits = defineEmits<BaseSelectEmits>();

const uniqueId = computed(() => `${props.name}-${uuidv4()}`);

const selectedValue = ref(props.modelValue ?? undefined);

const defaultFilterOption = (inputValue: string, option: SelectOption<T>) => option.label.toLowerCase().includes(inputValue.toLowerCase());

const filterOption = computed(() => {
  if (props.filterOption === false) return false;
  if (typeof props.filterOption === 'function') return props.filterOption;
  return defaultFilterOption;
});

const changeHandler = (value: string | number) => {
  selectedValue.value = value;
  emits('update:modelValue', value);
};

const searchHandler = (value: string) => {
  emits('search', value);
};

watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue;
});
</script>

<template>
  <Field
    v-slot="{ errorMessage }"
    :label="label"
    :model-value="modelValue"
    :name="name"
    :rules="rules"
  >
    <div class="flex items-center justify-between">
      <label v-if="label" :for="uniqueId" class="block text-gray-700 font-medium text-sm mb-[6px]">
        {{ label }} <span v-if="rules === 'required'" class="text-primary-600">*</span>
      </label>
      <slot name="label-prefix" />
    </div>
    <a-select
      :id="uniqueId"
      v-model:value="selectedValue"
      :class="errorMessage ? 'ant-input-status-error' : ''"
      :disabled="disabled"
      :allowClear="allowClear"
      :options="options"
      :max-tag-count="maxTagCount"
      :filter-option="filterOption"
      :mode="mode"
      :placeholder="placeholder"
      :show-search="showSearch"
      :show-arrow="showArrow ?? true"
      :loading="loading"
      class="w-full"
      size="large"
      @change="changeHandler"
      @search="searchHandler"
    >
      <template #prefix>
        <slot name="prefix" />
      </template>

      <template #suffix>
        <slot name="suffix" />
      </template>

      <template #dropdownRender="{ menuNode: menu }">
        <slot name="dropdownRender" :menuNode="menu">
          <component :is="menu" />
        </slot>
      </template>
    </a-select>

    <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
      {{ errorMessage }}
    </span>
  </Field>
</template>
