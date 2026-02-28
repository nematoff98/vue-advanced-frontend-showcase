<script lang="ts" setup>
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { computed } from 'vue';
import { LeadTimeline, LeadTimelineType } from '@/services/lead-timeline';

interface ChatLeadTimeLineProps {
  timelines: LeadTimeline[]
  isModal?: boolean
}

const props = defineProps<ChatLeadTimeLineProps>();

const groupedData = computed(() => {
  const grouped: Record<string, LeadTimeline[]> = {};

  if (props.isModal) {
    props.timelines.forEach((item) => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push(item);
    });
  } else {
    props.timelines.slice(0, 3).forEach((item) => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push(item);
    });
  }

  return Object.entries(grouped).map(([type, items]) => ({
    type: type as LeadTimeline['type'],
    items,
  }));
});

const typeIcons = {
  [LeadTimelineType.UPDATED]: Icons.REFRESH_SW,
  [LeadTimelineType.CREATED]: Icons.PLUS,
  [LeadTimelineType.DELETED]: Icons.TRASH,
} as Record<LeadTimelineType, Icons>;
</script>

<template>
  <ul>
    <template v-for="({ type, items }, index) in groupedData" :key="`type-${index}`">
      <!--    :key="timeline.id"  -->
      <li
        v-for="(timeline, idx) in items"
        :key="`inner-${idx}`"
        class="flex gap-2">
        <div v-if="idx === 0" class="flex flex-col items-center">
          <div class="w-7 h-7 flex items-center flex-shrink-0 justify-center bg-gray-100 rounded-full">
            <Icon v-if="type" :icon="typeIcons[type]" :size="12" class="text-gray-400" />
          </div>
          <a-divider class="h-full mx-0 w-[1px]" type="vertical" />
        </div>
        <div v-else class="flex flex-col items-center">
          <div class="w-3.5 h-3.5 bg-gray-100 rounded-full mx-[7px] flex-shrink-0" />
          <a-divider v-if="idx !== items.length - 1 || index !== groupedData.length - 1" class="h-full mx-0 w-[1px]" type="vertical" />
        </div>
        <div class="flex flex-col gap-0.5 pb-5">
          <p class="text-xs font-medium text-gray-400">{{ timeline.createdAt }}</p>
          <p v-if="idx === 0" class="text-sm font-bold text-gray-700">{{ timeline.title }}</p>
          <p class="text-xs font-medium text-gray-600">{{ timeline.description }}</p>
        </div>
      </li>
    </template>
  </ul>
</template>
