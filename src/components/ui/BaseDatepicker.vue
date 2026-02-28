<script lang="ts" setup>
import { Field } from 'vee-validate';
import {
  computed, onMounted, ref, type Slots, useSlots, watch,
} from 'vue';
import { v4 as uuidv4 } from 'uuid';
import dayjs, { Dayjs } from 'dayjs';

interface BaseDatePickerProps {
  name: string;
  rules?: string;
  label: string;
  component?: string;
  type?: string;
  placeholder?: string;
  valueFormat?: string;
  modelValue?: string | Date | Dayjs | undefined;
  disabledDate?: boolean;
}

const props = withDefaults(defineProps<BaseDatePickerProps>(), {
  valueFormat: 'YYYY-MM-DD',
});

const inputValue = ref<string | undefined | Dayjs | Date>(undefined);

const emits = defineEmits(['update:modelValue']);
const slots: Slots = useSlots();

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue ? dayjs(newValue, props.valueFormat) : undefined;
});

onMounted(() => {
  if (props.modelValue) inputValue.value = props.modelValue;
});

const uniqueId = computed(() => `${props.name}-${uuidv4()}`);
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
      {{ label }} <span v-if="rules === 'required'" class="text-primary-600">*</span>
    </label>

    <a-date-picker
      v-model:value="inputValue"
      :class="errorMessage ? 'ant-input-status-error' : ''"
      class="w-full"
      size="large"
      :value-format="valueFormat"
      v-bind="{ type, placeholder, id: uniqueId }"
      :disabled-date="disabledDate"
      @change="input"
    >
      <template v-if="slots.nextIcon" #nextIcon>
        <slot name="nextIcon" />
      </template>

      <template v-if="slots.presets" #presets>
        <slot name="presets" />
      </template>

      <template v-if="slots.prevIcon" #prevIcon>
        <slot name="prevIcon" />
      </template>

      <template v-if="slots.superNextIcon" #superNextIcon>
        <slot name="superNextIcon" />
      </template>

      <template v-if="slots.superPrevIcon" #superPrevIcon>
        <slot name="superPrevIcon" />
      </template>
    </a-date-picker>
    <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
      {{ errorMessage }}
    </span>
  </Field>
</template>
