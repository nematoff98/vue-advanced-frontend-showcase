<script setup lang="ts">
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { ref } from 'vue';

interface Props {
  message: string
}

defineProps<Props>();

const emailTemplateMessage = ref(false);
</script>

<template>
  <div>
    <a-card class="email-card" shadow="hover">
      <div class="email-title flex items-center">
        <Icon :icon="Icons.EMAIL" class="mr-2 text-gray-600" />
        Email Template sent
      </div>
      <div
        class="email-hint underline cursor-pointer"
        @click="emailTemplateMessage = true"
      >
        Click to view
      </div>
    </a-card>
    <a-modal
      v-model:open="emailTemplateMessage"
      width="700px"
      title="Email Template"
      :closable="true"
      :mask-closable="false"
      :footer="null"
    >
      <div class="email-content" v-html="message" />
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/styles/colors";
.email-message-container {
  cursor: pointer;
  max-width: 300px;
  margin: 8px 0;
}

.email-card {
  background-color: #fff;
  border-left: 4px solid #409eff;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.email-card:hover {
  background-color: #e6f0ff;
}

.email-title {
  font-weight: 600;
  font-size: 15px;
  color: var(--color-gray-700);
  @media (max-width: 500px) {
    font-size: 13px;
  }
}

.dark {
  .email-title {
    color: var(--color-gray-300);
  }
}

.email-hint {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.email-dialog .el-dialog__body {
  max-height: 70vh;
  overflow-y: auto;
}

.email-content {
  width: 100%;
  background: white;
  padding: 16px;
  border-radius: 6px;
}
</style>
