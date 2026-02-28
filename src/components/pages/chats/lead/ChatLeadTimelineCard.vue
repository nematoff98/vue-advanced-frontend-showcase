<script lang="ts" setup>
import ChatLeadTimelineModal from '@/components/pages/chats/lead/ChatLeadTimelineModal.vue';
import ChatLeadTimeline from '@/components/pages/chats/lead/ChatLeadTimeline.vue';
import { LeadTimeline, LeadTimelineServiceInstance } from '@/services/lead-timeline';
import {
  computed, onMounted, ref, watch,
} from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const timeline = ref<LeadTimeline[]>([]);
const isLoading = ref(false);

const fetchLeadTimeline = async (lId: number) => {
  isLoading.value = true;
  try {
    const data = await LeadTimelineServiceInstance.getLeadTimeline(+lId);
    timeline.value = data.reverse();
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const id = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

onMounted(() => {
  if (id.value) fetchLeadTimeline(id.value);
});
watch(id, (() => {
  if (id.value) fetchLeadTimeline(id.value);
}));

const modalOpen = ref<boolean>(false);
</script>

<template>
  <a-spin :spinning="isLoading">
    <div v-if="isLoading || timeline?.length" class="min-h-[100px] bg-white p-3 rounded-xl mt-4">
      <article v-if="timeline?.length" class="">
        <ChatLeadTimeline :timelines="timeline" />

        <a-button
          v-if="timeline?.length > 4"
          class="bg-gray-50 text-gray-700 w-full text-center text-xs font-medium"
          type="ghost"
          @click="modalOpen = true"
        >Show more</a-button>

        <ChatLeadTimelineModal
          v-model:open="modalOpen"
          :timeline="timeline"
        />
      </article>
    </div>
  </a-spin>
</template>

<style lang="scss" scoped>

</style>
