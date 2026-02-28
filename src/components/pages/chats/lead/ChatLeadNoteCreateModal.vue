<script setup lang="ts">
import { ref, watch } from 'vue';
import { UploadProps, message } from 'ant-design-vue';
import { UploadFile } from 'ant-design-vue/lib/upload/interface';
import { useErrorNotification } from '@/composables/useErrorNotification';
import {
  CreateLeadCommentPayload,
  LeadComment,
  LeadCommentServiceInstance,
} from '@/services/lead-comment';

interface Props {
  open: boolean;
  leadId: number | null;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'created', note: LeadComment): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { showErrorNotification } = useErrorNotification();

const commentText = ref('');
const attachments = ref<File[]>([]);
const fileList = ref<UploadFile[]>([]);
const isSubmitting = ref(false);

const allowedExtensions = ['jpeg', 'jpg', 'png', 'pdf', 'doc', 'docx'];

const resetForm = () => {
  commentText.value = '';
  attachments.value = [];
  fileList.value = [];
};

const closeModal = () => {
  emits('update:open', false);
  resetForm();
};

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !allowedExtensions.includes(extension)) {
    message.error('Allowed file types: jpeg, jpg, png, pdf, doc, docx');
    return false;
  }
  attachments.value.push(file as File);
  fileList.value.push({
    uid: `${Date.now()}-${file.name}`,
    name: file.name,
    status: 'done',
  });
  return false;
};

const removeAttachment = (file: UploadFile) => {
  const index = fileList.value.findIndex((item) => item.uid === file.uid);
  if (index > -1) {
    fileList.value.splice(index, 1);
    attachments.value.splice(index, 1);
  }
};

const submitNote = async () => {
  if (!props.leadId) return;
  if (!commentText.value.trim()) return;
  isSubmitting.value = true;
  try {
    const payload: CreateLeadCommentPayload = {
      content: commentText.value.trim(),
      attachments: attachments.value.length ? attachments.value : null,
    };
    const formData = new FormData();
    formData.append('content', payload.content);
    if (payload.attachments?.length) {
      payload.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }
    const created = await LeadCommentServiceInstance.create(props.leadId, formData);
    emits('created', created);
    closeModal();
  } catch (err) {
    showErrorNotification(err);
  } finally {
    isSubmitting.value = false;
  }
};

watch(() => props.open, (isOpen) => {
  if (isOpen) resetForm();
});
</script>

<template>
  <a-modal
    :open="open"
    :footer="null"
    centered
    title="Add note"
    :mask-closable="false"
    width="560px"
    @cancel="closeModal"
  >
    <div class="note-form">
      <a-textarea
        v-model:value="commentText"
        :rows="4"
        placeholder="Write a note..."
        class="note-textarea"
      />
      <div class="flex items-center justify-between mt-4 flex-wrap gap-2">
        <a-upload
          :before-upload="beforeUpload"
          :show-upload-list="false"
          multiple
          accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
        >
          <a-button class="btn-m btn-gray">
            Attach file
          </a-button>
        </a-upload>
        <a-button
          type="primary"
          class="btn-m"
          :loading="isSubmitting"
          :disabled="!commentText.trim()"
          @click="submitNote"
        >
          Save
        </a-button>
      </div>
      <div v-if="fileList.length" class="mt-4 flex flex-wrap gap-2">
        <div
          v-for="file in fileList"
          :key="file.uid"
          class="file-pill"
        >
          <span class="truncate">{{ file.name }}</span>
          <button type="button" class="file-pill__remove" @click="removeAttachment(file)">
            X
          </button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">
.note-textarea {
  @apply text-sm rounded-xl;
}

.file-pill {
  @apply flex items-center gap-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full;
  max-width: 180px;
}

.file-pill__remove {
  @apply text-gray-400 hover:text-gray-600;
}
</style>
