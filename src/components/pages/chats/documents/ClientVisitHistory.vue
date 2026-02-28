<script lang="ts" setup>

import { computed, ref, watchEffect } from 'vue';
import { useLeadVisitStore } from '@/stores/useLeadVisitStore';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { LeadVisitPage, leadVisitPageTextMap } from '@/services/lead-visit';

interface Props {
  leadId: number
}

const props = defineProps<Props>();

const leadVisitStore = useLeadVisitStore();
const { visits } = storeToRefs(leadVisitStore);

watchEffect(() => {
  leadVisitStore.fetchVisitsByLead(props.leadId);
});

const data = computed(() => visits.value?.items?.map((v) => ({ ...v, createdAt: dayjs(v.createdAt).format('DD MMM YYYY, HH:mm') })));

const columns = ref([
  {
    title: 'Client ID',
    dataIndex: 'clientId',
    key: 'clientId',
  },
  {
    title: 'Page',
    dataIndex: 'page',
    key: 'page',
  },
  {
    title: 'Created at',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
]);

</script>

<template>

  <a-table :scroll="{ x: 'max-content' }" :columns="columns" :dataSource="data">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'clientId'">
        #{{ record.id }}
      </template>

      <template v-if="column.dataIndex === 'page'">
        {{ leadVisitPageTextMap[record.page as LeadVisitPage] }}
      </template>

      <template v-if="column.dataIndex === 'createdAt'">
        {{ record.createdAt }}
      </template>

    </template>
  </a-table>
</template>

<style lang="scss" scoped>

</style>
