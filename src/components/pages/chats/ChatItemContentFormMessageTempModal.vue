<script lang="ts" setup>
import { ref, watch } from 'vue';
import {
  MessageChannel, ChatServiceInstance, MessageTemplate, sendMessageChannelOptions,
} from '@/services/chat';
import { useErrorNotification } from '@/composables/useErrorNotification';
import { useRoute } from 'vue-router';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { component as ckeditor } from '@mayasabha/ckeditor4-vue3';
import BaseInput from '@/components/ui/BaseInput.vue';
import { Form } from 'vee-validate';

const useErrorNotify = useErrorNotification();
const route = useRoute();

interface ChatItemEditContactModalProps {
  open: boolean
}

interface ChatItemEditContactModalEmits {
  (e: 'update:open', value: boolean): void

  (e: 'send-template', item: {
    value: string,
    channel: MessageChannel,
    subjectValue?: string,
    templateId?: number
  }): void
}

const props = defineProps<ChatItemEditContactModalProps>();
const emits = defineEmits<ChatItemEditContactModalEmits>();

const editorConfig = {
  height: 450,
  allowedContent: true,
  extraAllowedContent: '*[*]{*}(*);',
  autoParagraph: false,
  enterMode: 2,
  fullPage: true,
};

const channel = ref<MessageChannel>();
const template = ref(undefined);
const message = ref<string>();
const subject = ref<string>();
const templates = ref<MessageTemplate[]>([]);
const templatesLoading = ref(false);
const replacedMessageLoading = ref(false);
const messageTemplateId = ref();

// const isEscapedHTML = (str: string): boolean => /&lt;|&gt;|&amp;|&quot;|&#39;/.test(str);

// const decodeHTMLEntities = (str?: string): string => {
//   if (!str) return '';
//   if (!isEscapedHTML(str)) return str;
//
//   const textarea = document.createElement('textarea');
//   textarea.innerHTML = str;
//   return textarea.value;
// };

watch(() => props.open, (newValue) => {
  if (!newValue) {
    channel.value = undefined;
    template.value = undefined;
    message.value = undefined;
    messageTemplateId.value = undefined;
  }
});

const selectTemplate = async (id?: number) => {
  const selectedTemplate = templates.value.find((t) => t.id === id);
  const { leadId } = route.query;
  if (!selectedTemplate?.id || !leadId) return;
  replacedMessageLoading.value = true;
  try {
    const { body, subject: subjectValue } = await ChatServiceInstance.getMessageTemplateReplacedBody(selectedTemplate.id, +leadId);
    message.value = body;
    subject.value = subjectValue;
    messageTemplateId.value = id;
  } catch (err) {
    console.error(err);
  } finally {
    replacedMessageLoading.value = false;
  }
  // message.value = decodeHTMLEntities(selectedTemplate.body);
};

const getTemplates = async () => {
  templates.value = [];
  template.value = undefined;
  message.value = undefined;
  messageTemplateId.value = undefined;
  templatesLoading.value = true;
  const { chatId } = route.query;
  if (!chatId || !channel.value) return;
  try {
    const templateList = await ChatServiceInstance.getMessageTemplates(+chatId, channel.value);
    if (!templateList.length) return;
    templates.value = templateList.map((p) => ({
      ...p,
      name: `${p.triggerText} - ${p.name}`,
    }));
  } catch (err) {
    useErrorNotify.showErrorNotification(err);
  } finally {
    templatesLoading.value = false;
  }
};

const send = () => {
  if (message.value && channel.value) {
    emits('send-template', {
      value: message.value, channel: channel.value, subjectValue: subject.value, templateId: messageTemplateId.value,
    });
  }
  emits('update:open', false);
};
</script>

<template>
  <a-modal
    :footer="null"
    :open="open"
    centered
    :mask-closable="false"
    closable
    title="Choose template or generate"
    :width="channel === MessageChannel.EMAIL ? '1100px' : '700px'"
    @cancel="$emit('update:open', false)"
  >
    <Form
      autocomplete="off"
      class="default-form"
      layout="vertical"
      name="basic"
      @submit="send"
    >
      <a-row :gutter="[16, 16]">
        <a-col :span="channel === MessageChannel.EMAIL ? 10 : 24">
          <a-row>
            <a-col :span="24">
              <a-select
                v-model:value="channel"
                :loading="templatesLoading"
                :options="sendMessageChannelOptions"
                class="w-full"
                placeholder="Select message type"
                size="large"
                @change="getTemplates"
              />
            </a-col>
            <a-col :span="24" class="mt-4">
              <a-spin :spinning="templatesLoading">
                <a-select
                  v-model:value="template"
                  :disabled="templatesLoading || !channel"
                  :field-names="{ label: 'name', value: 'id' }"
                  :options="templates"
                  class="w-full"
                  name="template"
                  placeholder="Template"
                  size="large"
                  @change="selectTemplate(template)"
                />
              </a-spin>
            </a-col>
            <a-col v-if="channel === MessageChannel.EMAIL" :span="24" class="mt-4">
              <BaseInput
                v-model="subject"
                class="w-full"
                name="subject"
                placeholder="Subject"
                size="large"
                rules="required"
              />
            </a-col>
            <a-col v-if="channel !== MessageChannel.EMAIL" :span="24" class="mt-4">
              <a-spin :spinning="replacedMessageLoading">
                <a-textarea
                  v-model:value="message"
                  :disabled="!template"
                  :rows="6"
                  placeholder="Answer:"
                />
              </a-spin>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="channel === MessageChannel.EMAIL ? 14 : 24">
          <a-row>
            <a-col v-if="channel === MessageChannel.EMAIL" :span="24" class="">
              <a-spin :spinning="replacedMessageLoading">
                <ckeditor v-model="message" :config="editorConfig" />
              </a-spin>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <div class="flex items-center justify-end border-t border-gray-100 pt-3 mt-2">
        <a-button
          class="h-10 text-s"
          type="ghost"
          @click="$emit('update:open', false)"
        >Cancel
        </a-button>
        <a-button
          :disabled="!message"
          class="h-10 rounded-xl text-s flex items-center gap-2"
          html-type="submit"
          type="primary"
        >
          Send
          <Icon :icon="Icons.SEND" />
        </a-button>
      </div>
    </Form>
  </a-modal>
</template>
