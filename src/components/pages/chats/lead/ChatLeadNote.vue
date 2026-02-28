<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useErrorNotification } from '@/composables/useErrorNotification';
import { FullLeadInfo } from '@/services/lead';
import { LeadComment, LeadCommentServiceInstance } from '@/services/lead-comment';
import ChatLeadNoteCreateModal from '@/components/pages/chats/lead/ChatLeadNoteCreateModal.vue';
import ChatLeadNoteList from '@/components/pages/chats/lead/ChatLeadNoteList.vue';

const route = useRoute();
const { showErrorNotification } = useErrorNotification();

interface Props {
  activeLead?: FullLeadInfo
  loading?: boolean
}

const props = defineProps<Props>();

const notes = ref<LeadComment[]>([]);
const showAddForm = ref(false);
const isShowingAll = ref(false);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const deletingNoteId = ref<number | null>(null);

const page = ref(1);
const perPage = 10;
const hasMore = ref(false);

const leadId = computed(() => {
  const id = Number(route.query.leadId);
  return Number.isNaN(id) ? null : id;
});

const isBusy = computed(() => props.loading || isLoading.value);

const loadLatestNotes = async () => {
  if (!leadId.value) return;
  isLoading.value = true;
  try {
    notes.value = await LeadCommentServiceInstance.getLatest(leadId.value);
  } catch (err) {
    showErrorNotification(err);
  } finally {
    isLoading.value = false;
  }
};

const loadAllNotes = async (reset = false) => {
  if (!leadId.value) return;
  if (reset) {
    page.value = 1;
    notes.value = [];
  }
  if (reset) isLoading.value = true;
  else isLoadingMore.value = true;

  try {
    const { items, hasMorePages } = await LeadCommentServiceInstance.getAll(leadId.value, {
      page: page.value,
      perPage,
    });
    notes.value = reset ? items : [...notes.value, ...items];
    hasMore.value = !!hasMorePages;
  } catch (err) {
    showErrorNotification(err);
  } finally {
    if (reset) isLoading.value = false;
    else isLoadingMore.value = false;
  }
};

const showAllNotes = async () => {
  isShowingAll.value = true;
  await loadAllNotes(true);
};

const showLatestNotes = async () => {
  isShowingAll.value = false;
  await loadLatestNotes();
};

const handleLoadMore = () => {
  if (!isShowingAll.value || !hasMore.value || isLoadingMore.value) return;
  page.value += 1;
  loadAllNotes(false);
};

watch(leadId, (newLeadId) => {
  if (!newLeadId) return;
  isShowingAll.value = false;
  showAddForm.value = false;
  loadLatestNotes();
}, { immediate: true });

const handleCreatedNote = (created: LeadComment) => {
  const newNote = created || {
    id: Date.now(),
    leadId: leadId.value || 0,
    userId: 0,
    content: '',
    createdAt: new Date().toISOString(),
    attachments: [],
  };
  notes.value = [newNote, ...notes.value];
  if (!isShowingAll.value) {
    notes.value = notes.value.slice(0, 3);
  }
};

const handleDeleteNote = async (note: LeadComment, done: (success: boolean) => void) => {
  if (!leadId.value) return;
  deletingNoteId.value = note.id;
  try {
    await LeadCommentServiceInstance.delete(leadId.value, note.id);
    notes.value = notes.value.filter((item) => item.id !== note.id);
    if (isShowingAll.value) {
      if (!notes.value.length) {
        await loadAllNotes(true);
      }
    } else {
      await loadLatestNotes();
      if (!notes.value.length) {
        isShowingAll.value = true;
        await loadAllNotes(true);
      }
    }
    done(true);
  } catch (err) {
    showErrorNotification(err);
    done(false);
  } finally {
    deletingNoteId.value = null;
  }
};
</script>

<template>
  <a-spin :spinning="isBusy">
    <div class="chat-lead-notes bg-white rounded-2xl p-4 my-4 border border-gray-100">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2 text-gray-700 font-semibold">
          Notes
        </div>
        <div class="flex items-center gap-2">
          <a-button
            v-if="!isShowingAll && notes.length >= 3"
            class="btn-m btn-gray"
            @click="showAllNotes"
          >
            Show all
          </a-button>
          <a-button
            v-else-if="isShowingAll"
            class="btn-m btn-gray"
            @click="showLatestNotes"
          >
            Latest
          </a-button>
          <a-button class="btn-m btn-gray" @click="showAddForm = true">
            Add note
          </a-button>
        </div>
      </div>

      <ChatLeadNoteList
        :notes="notes"
        :is-showing-all="isShowingAll"
        :is-busy="isBusy"
        :is-loading-more="isLoadingMore"
        :has-more="hasMore"
        :deleting-note-id="deletingNoteId"
        @load-more="handleLoadMore"
        @delete="handleDeleteNote"
      />
    </div>
    <ChatLeadNoteCreateModal
      v-model:open="showAddForm"
      :lead-id="leadId"
      @created="handleCreatedNote"
    />
  </a-spin>
</template>

<style scoped lang="scss">
.chat-lead-notes {
  animation: fade-in 0.35s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
