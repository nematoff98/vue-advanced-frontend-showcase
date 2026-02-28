<script setup lang="ts">
import { Field } from 'vee-validate';
import { computed, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { UploadProps } from 'ant-design-vue';
import { FileType } from 'ant-design-vue/lib/upload/interface';

interface BaseInputProps {
  name: string;
  rules?: string | Record<string, unknown>;
  label?: string;
  placeholder?: string;
  modelValue?: FileType;
  removeLabel?: boolean;
  disabled?: boolean;
}

interface BaseInputEmits {
  (e: 'update:modelValue', value?: FileType): void
}

const props = defineProps<BaseInputProps>();
const emits = defineEmits<BaseInputEmits>();

const uniqueId = `${props.name}-${uuidv4()}`;
const isInputRequired = computed(() => {
  if (!props.rules) return false;
  if (typeof props.rules === 'string') return props.rules.includes('required');
  return props.rules.required;
});

const uploadFile = ref();
const fileList = computed(() => {
  if (uploadFile.value) {
    return [uploadFile.value];
  }
  return [];
});

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  uploadFile.value = file;
  emits('update:modelValue', file);
  return false;
};

const onRemove: UploadProps['onRemove'] = () => {
  uploadFile.value = undefined;
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

      <a-upload
        class="w-full"
        :file-list="fileList"
        :before-upload="beforeUpload"
        accept="image/*,application/pdf"
        @remove="onRemove"
        v-bind="$attrs"
        :id="uniqueId"
        :disabled="disabled"
      >
        <a-button>
          <Icon :icon="Icons.UPLOAD_OUTLINED" />
          {{ placeholder || 'Upload file' }}
        </a-button>
      </a-upload>
      <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
        {{ errorMessage }}
      </span>
    </Field>
  </div>
</template>
