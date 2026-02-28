<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { message } from 'ant-design-vue';
import { copyToClipboard } from '@/utils/_helpers';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { LeadComment } from '@/services/lead-comment';

interface Props {
  notes: LeadComment[];
  isShowingAll: boolean;
  isBusy: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  deletingNoteId?: number | null;
}

interface Emits {
  (e: 'load-more'): void;
  (e: 'delete', note: LeadComment, done: (success: boolean) => void): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const copiedAttachmentUrl = ref<string | null>(null);
const copiedResetTimeout = ref<number | null>(null);
const openConfirmId = ref<number | null>(null);

const formatDate = (date: string) => date;

const shareAttachment = (fileUrl: string) => {
  copyToClipboard(fileUrl);
  message.success('Link copied to clipboard');
};

const markCopied = (fileUrl: string) => {
  copiedAttachmentUrl.value = fileUrl;
  if (copiedResetTimeout.value) {
    window.clearTimeout(copiedResetTimeout.value);
  }
  copiedResetTimeout.value = window.setTimeout(() => {
    copiedAttachmentUrl.value = null;
    copiedResetTimeout.value = null;
  }, 1500);
};

const handleCopyAttachment = (fileUrl: string) => {
  shareAttachment(fileUrl);
  markCopied(fileUrl);
};

const confirmDelete = (note: LeadComment) => {
  emits('delete', note, (success) => {
    if (success) openConfirmId.value = null;
  });
};

const handleScroll = (event: Event) => {
  if (!props.isShowingAll || !props.hasMore || props.isLoadingMore) return;
  const target = event.target as HTMLElement;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 60) {
    emits('load-more');
  }
};

onBeforeUnmount(() => {
  if (copiedResetTimeout.value) {
    window.clearTimeout(copiedResetTimeout.value);
  }
});
</script>

<template>
  <div
    class="notes-list"
    :class="isShowingAll ? 'max-h-[380px] overflow-y-auto scroll-hidden pr-2' : ''"
    @scroll="handleScroll"
  >
    <transition-group name="note-list" tag="div" class="flex flex-col gap-3">
      <div
        v-for="note in notes"
        :key="note.id"
        class="note-item p-3 rounded-xl border border-gray-200 bg-gray-50"
      >
        <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span class="font-medium text-gray-600">{{ note.user?.name || 'Team' }}</span>
          <div class="flex items-center gap-2">
            <span>{{ formatDate(note.createdAt) }}</span>
            <a-popconfirm
              title="Delete note?"
              ok-text="Delete"
              cancel-text="Cancel"
              :open="openConfirmId === note.id"
              :ok-button-props="{ loading: deletingNoteId === note.id }"
              @confirm="confirmDelete(note)"
              @cancel="openConfirmId = null"
            >
              <a-button
                type="text"
                size="small"
                class="note-action-btn"
                :loading="deletingNoteId === note.id"
                @click="openConfirmId = note.id"
              >
                <template v-if="deletingNoteId !== note.id">
                  <Icon :icon="Icons.TRASH" size="14" />
                </template>
              </a-button>
            </a-popconfirm>
          </div>
        </div>
        <div class="text-sm text-gray-700 whitespace-pre-wrap">
          {{ note.content }}
        </div>
        <div v-if="note.attachments?.length" class="mt-2 flex flex-wrap gap-2">
          <div
            v-for="(attachment, index) in note.attachments"
            :key="attachment.id"
            class="note-attachment"
          >
            <a
              :href="attachment.fileUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="note-attachment__link"
            >
              File {{ index + 1 }}
            </a>
            <button
              type="button"
              class="note-attachment__share"
              @click="handleCopyAttachment(attachment.fileUrl)"
              aria-label="Copy link"
            >
              <Icon
                :icon="copiedAttachmentUrl === attachment.fileUrl ? Icons.CHECK : Icons.COPY"
                size="14"
              />
            </button>
          </div>
        </div>
      </div>
    </transition-group>
    <div v-if="!notes.length && !isBusy" class="text-sm text-gray-400 py-6 text-center">
      No notes yet. Add the first one.
    </div>
    <div v-if="isLoadingMore" class="flex justify-center py-3 text-gray-500 text-xs">
      Loading more...
    </div>
  </div>
</template>

<style scoped lang="scss">
.note-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.note-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.note-attachment {
  @apply flex items-center gap-2 text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full;
  max-width: 100%;
}

.note-attachment__link {
  @apply text-primary-600 hover:text-primary-700 underline;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.note-attachment__share {
  @apply text-[11px] text-primary-700 bg-white border border-primary-200 rounded-full px-2 py-0.5;
  white-space: nowrap;
}

.note-action-btn {
  @apply text-gray-400 hover:text-red-500 transition-colors;
}

.note-list-enter-active,
.note-list-leave-active {
  transition: all 0.35s ease;
}

.note-list-enter-from,
.note-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
