<script lang="ts" setup>
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { computed, ref, watch } from 'vue';
import GlobalSearchDriver from '@/components/ui/modals/global-search/GlobalSearchDriver.vue';
import GlobalSearchMessage from '@/components/ui/modals/global-search/GlobalSearchMessage.vue';
import GlobalSearchLead from '@/components/ui/modals/global-search/GlobalSearchLead.vue';
import {
  GlobalSearchDriverData, GlobalSearchInstance, GlobalSearchLeadData, GlobalSearchMessageData, GlobalSearchParams, GlobalSearchType,
} from '@/services/global-search';
import { debounce } from 'lodash';
import { useRoute } from 'vue-router';

const route = useRoute();

interface Props {
  open: boolean
}

interface Emits {
  (e: 'modalClose', open: boolean): void
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const searchBy = ref<GlobalSearchType>(GlobalSearchType.LEAD);
const isLoading = ref(false);
const leadsSearchResult = ref<GlobalSearchLeadData[]>([]);
const driversSearchResult = ref<GlobalSearchDriverData[]>([]);
const messagesSearchResults = ref<GlobalSearchMessageData[]>([]);
const searchQuery = ref('');
const matchExactly = ref(false);

const fetchResults = async () => {
  // if (!searchQuery.value) return;
  isLoading.value = true;
  try {
    const params: GlobalSearchParams = {};
    if (searchQuery.value) params.search = searchQuery.value;
    if (matchExactly.value) params.exactly = searchQuery.value;
    if (!searchQuery.value) {
      if (searchBy.value === GlobalSearchType.LEAD) leadsSearchResult.value = [];
      if (searchBy.value === GlobalSearchType.DRIVER) driversSearchResult.value = [];
      if (searchBy.value === GlobalSearchType.MESSAGE) messagesSearchResults.value = [];
      return;
    }

    if (searchBy.value === GlobalSearchType.LEAD) {
      const { items: leads } = await GlobalSearchInstance.searchLeads(params);
      leadsSearchResult.value = leads;
    } else if (searchBy.value === GlobalSearchType.DRIVER) {
      const { items: drivers } = await GlobalSearchInstance.searchDrivers(params);
      driversSearchResult.value = drivers;
    } else if (searchBy.value === GlobalSearchType.MESSAGE) {
      const { items: messages } = await GlobalSearchInstance.searchMessages(params);
      messagesSearchResults.value = messages;
    }
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const setSearchBy = (value: GlobalSearchType) => {
  searchBy.value = value;
};

const currentResults = computed(() => {
  if (searchBy.value === GlobalSearchType.LEAD) {
    return leadsSearchResult.value;
  } if (searchBy.value === GlobalSearchType.DRIVER) {
    return driversSearchResult.value;
  } if (searchBy.value === GlobalSearchType.MESSAGE) {
    return messagesSearchResults.value;
  }
  return [];
});

const startSearch = debounce(fetchResults, 400);

const tabs = ref([
  { label: 'Leads', icon: Icons.USERS, value: GlobalSearchType.LEAD },
  { label: 'Drivers', icon: Icons.CAR, value: GlobalSearchType.DRIVER },
  { label: 'Messages', icon: Icons.MESSAGE_SQUARE, value: GlobalSearchType.MESSAGE },
]);

const changeSearchBy = (value: GlobalSearchType) => {
  setSearchBy(value);
  fetchResults();
};

const closeModal = () => {
  emit('modalClose', false);
};

watch(() => route.query, () => {
  closeModal();
});

</script>

<template>
  <a-modal
    :footer="null"
    :open="open"
    title="Global search"
    width="700px"
    @cancel="closeModal"
  >
    <a-input
      v-model:value="searchQuery"
      :allow-clear="true"
      :bordered="false"
      class="rounded-[10px] mb-3 text-sm search-box"
      placeholder="Search..."
      @input="startSearch"
    >
      <template #prefix>
        <Icon :icon="Icons.SEARCH" :size="20" class="mr-2" />
      </template>
    </a-input>

    <ul class="flex items-center gap-1.5 mb-3">
      <li v-for="tab in tabs" :key="tab.label">
        <a-button
          :class="{ 'bg-gray-50 text-gray-700': searchBy !== tab.value }"
          :type="searchBy === tab.value ? 'primary' : 'ghost'"
          class="flex items-center gap-2"
          size="large"
          @click="changeSearchBy(tab.value)"
        >
          <Icon :icon="tab.icon" :size="20" />
          <span>{{ tab.label }}</span>
        </a-button>
      </li>
      <li class="ms-auto">
        <a-checkbox
          v-model:checked="matchExactly"
          class="border border-gray-200 py-3 px-4 rounded-xl text-gray-700 text-sm font-medium h-10 flex items-center justify-center">
          Match Exactly
        </a-checkbox>
      </li>
    </ul>

    <a-spin :spinning="isLoading">
      <!--      <div v-if="isLoading" class="text-center py-4">Loading...</div>-->
      <ul v-if="currentResults.length" class="grid grid-cols-2 gap-[11px]">
        <li v-for="(result, i) in currentResults" :key="`result-${i}`" class="border border-gray-100 py-4 px-3 rounded-xl">
          <GlobalSearchLead v-if="searchBy === GlobalSearchType.LEAD" :lead="result as GlobalSearchLeadData" />
          <GlobalSearchDriver v-else-if="searchBy === GlobalSearchType.DRIVER" :driver="result as GlobalSearchDriverData" />
          <GlobalSearchMessage v-else-if="searchBy === GlobalSearchType.MESSAGE" :message="result as GlobalSearchMessageData" />
        </li>
      </ul>
      <a-empty v-else />
    </a-spin>
  </a-modal>
</template>

<style lang="scss">
.search-box {
  background-color: var(--color-gray-50) !important;
  height: 2.5rem;
}

.dark {
  .search-box {
    background-color: var(--color-gray-700) !important;
  }
}
</style>
