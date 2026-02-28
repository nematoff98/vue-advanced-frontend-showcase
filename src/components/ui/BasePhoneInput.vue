<script setup lang="ts">
import { vMaska } from 'maska/vue';
import { computed, ref, watch } from 'vue';
import { Field } from 'vee-validate';
import { v4 as uuidv4 } from 'uuid';

interface BasePhoneProps {
  name: string;
  rules?: string;
  label?: string;
  type?: string;
  value?: string;
  mask?: string;
  placeholder?: string;
  large?: string
}

interface BasePhoneEmits {
  (event: 'update:value', value?: string): void;
}

const props = withDefaults(defineProps<BasePhoneProps>(), {
  mask: '(###) ###-##-##',
  placeholder: '',
  large: 'large',
});

const emit = defineEmits<BasePhoneEmits>();

const inputValue = ref(props.value);

const cleanedValue = computed(() => inputValue.value?.replace(/\D+/g, ''));
const uniqueId = computed(() => `${props.name}-${uuidv4()}`);

watch(inputValue, () => {
  emit('update:value', cleanedValue.value);
});

watch(
  () => props.value,
  (newValue) => {
    if (newValue !== cleanedValue.value) {
      inputValue.value = newValue;
    }
  },
);
</script>

<template>
  <Field
    :name="name"
    v-slot="{ errorMessage }"
    :model-value="value"
    :label="label"
    :rules="rules"
  >
    <label v-if="label" :for="uniqueId" class="block text-gray-700 font-medium text-sm mb-[6px]">
      {{ label }} <span v-if="rules === 'required'" class="text-primary-600">*</span>
    </label>
    <a-input
      v-model:value="inputValue"
      v-maska="mask"
      v-bind="$attrs"
      :placeholder="placeholder"
      :size="large"
      :class="errorMessage ? 'ant-input-status-error' : ''"
    />
    <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
      {{ errorMessage }}
    </span>
  </Field>
</template>
