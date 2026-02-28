<script setup lang="ts">
import { vMaska } from 'maska/vue';
import {
  computed, onMounted, onUnmounted, ref, watch,
} from 'vue';
import { Field } from 'vee-validate';
import { v4 as uuidv4 } from 'uuid';

interface CodeInputProps {
  value?: string,
  duration?: number,
  reset: boolean,
  name: string;
  rules?: string;
  label: string;
  component?: string;
  type?: string;
  placeholder?: string;
}

interface CodeInputEmits {
  (e: 'update:value', value: string): void;

  (e: 'end-time'): void;
}

const props = withDefaults(defineProps<CodeInputProps>(), {
  duration: 60,
});

const emit = defineEmits<CodeInputEmits>();

const inputValue = ref(props.value);

const timeLeft = ref(props.duration);

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

let timerInterval: NodeJS.Timeout | null = null;

const uniqueId = computed(() => `${props.name}-${uuidv4()}`);

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timeLeft.value = props.duration;

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1;
    } else {
      clearInterval(timerInterval!);
      timerInterval = null;
      emit('end-time');
    }
  }, 1000);
};

watch(inputValue, (newValue) => {
  if (newValue || newValue === '') emit('update:value', newValue);
});

watch(
  () => props.reset,
  (newValue) => {
    if (newValue) startTimer();
  },
  { immediate: true },
);

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <Field
    :name="name"
    v-slot="{ errorMessage }"
    :model-value="value"
    :label="label"
    :rules="rules"
  >
    <label :for="uniqueId" class="block text-gray-700 font-medium text-sm mb-[6px]">
      {{ label }} <span v-if="rules === 'required'" class="text-primary-600">*</span>
    </label>
    <a-input
      v-model:value="inputValue"
      v-maska="'######'"
      :suffix="formattedTime"
      size="large"
      placeholder="Enter Code"
      :class="errorMessage ? 'ant-input-status-error' : ''"
    />
    <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
      {{ errorMessage }}
    </span>
  </Field>
</template>
