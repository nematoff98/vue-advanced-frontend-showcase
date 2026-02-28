<script lang="ts" setup>
import Icon from '@/components/icon/Icon.vue';
import { FetchChatsParams } from '@/services/chat';
import { Icons } from '@/components/icon/helpers';
import { LeadStatus } from '@/services/lead';
import { debounce } from 'lodash';
import { ref } from 'vue';

interface ChatListHeaderEmits {
  (e: 'filter', filter: FetchChatsParams): void;
  (e: 'reset-filter'): void;
}

const emits = defineEmits<ChatListHeaderEmits>();

const searchQuery = ref('');
const isFilterOpen = ref(false);
const filter = ref<FetchChatsParams>({});

const startFilter = debounce(() => {
  emits('filter', { ...filter.value, search: searchQuery.value });
}, 300);

const handleLeadStatusChange = (status: LeadStatus) => {
  filter.value.leadStatus = status;
  startFilter();
};

const toggleNotAnswered = () => {
  filter.value.notAnswered = !filter.value.notAnswered;
  startFilter();
};

const toggleUnreadMessage = () => {
  filter.value.unread = !filter.value.unread;
  startFilter();
};

const resetFilter = () => {
  filter.value = {};
  emits('reset-filter');
};
</script>

<template>
  <div class="flex items-center gap-2 mt-2 mx-2 mb-2.5">
    <a-input
      v-model:value="searchQuery"
      :allow-clear="true"
      :bordered="false"
      class="rounded-[10px] search-box h-10 !bg-gray-50"
      placeholder="Search..."
      @input="startFilter"
    >
      <template #prefix>
        <Icon :icon="Icons.SEARCH" class="mr-2" />
      </template>
    </a-input>
    <a-dropdown v-model:open="isFilterOpen" placement="bottomRight" trigger="click">
      <a-button class="filter-btn w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white" size="large" type="text">
        <Icon :icon="Icons.SLIDERS_HORIZONTAL" />
      </a-button>
      <template #overlay>
        <a-menu class="!p-0 overflow-hidden">
          <a-menu-item key="1" class="h-10 !rounded-none !px-4">
            <div
              class="flex items-center gap-2"
              @click="toggleUnreadMessage"
            >
              <Icon :icon="Icons.MESSAGE_SQUARE" class="text-gray-600" :class="{ 'text-primary-600': filter.unread }" />
              <span class="text-gray-700 font-normal text-sm" :class="{ 'text-primary-600': filter.unread }">Unread Message</span>
            </div>
          </a-menu-item>
          <a-menu-item key="2" class="h-10 !rounded-none !px-4">
            <div class="flex items-center gap-2" @click="toggleNotAnswered">
              <Icon :class="{ 'text-primary-600': filter.notAnswered }" :icon="Icons.HELP_CIRCLE" class="text-gray-600" />
              <span :class="{ 'text-primary-600': filter.notAnswered }" class="text-gray-700 font-normal text-sm">Not answered</span>
            </div>
          </a-menu-item>
          <a-menu-item key="3" class="h-10 !rounded-none !px-4" @click="handleLeadStatusChange(LeadStatus.NEW)">
            <div class="flex items-center gap-2">
              <Icon
                :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.NEW }"
                :icon="Icons.USER_PLUS"
                class="text-gray-600"
              />
              <span
                :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.NEW }"
                class="text-gray-700 font-normal text-sm"
              >New leads</span>
            </div>
          </a-menu-item>
          <a-menu-item key="4" class="h-10 !rounded-none !px-4" @click="handleLeadStatusChange(LeadStatus.ORDER)">
            <div class="flex items-center gap-2">
              <Icon :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.ORDER }" :icon="Icons.BOX" class="text-gray-600" />
              <span :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.ORDER }" class="text-gray-700 font-normal text-sm">Order</span>
            </div>
          </a-menu-item>
          <a-menu-item key="5" class="h-10 !rounded-none !px-4" @click="handleLeadStatusChange(LeadStatus.SIGNED)">
            <div class="flex items-center gap-2">
              <Icon :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.SIGNED }" :icon="Icons.CLIPBOARD" class="text-gray-600" />
              <span :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.SIGNED }" class="text-gray-700 font-normal text-sm">Signed</span>
            </div>
          </a-menu-item>
          <a-menu-item key="6" class="h-10 !rounded-none !px-4" @click="handleLeadStatusChange(LeadStatus.PAID)">
            <div class="flex items-center gap-2">
              <Icon :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.PAID }" :icon="Icons.DOLLAR_SIGN" class="text-gray-600" />
              <span :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.PAID }" class="text-gray-700 font-normal text-sm">Paid</span>
            </div>
          </a-menu-item>
          <a-menu-item key="7" class="h-10 !rounded-none !px-4" @click="handleLeadStatusChange(LeadStatus.POSTED)">
            <div class="flex items-center gap-2">
              <Icon
                :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.POSTED }"
                :icon="Icons.TRUCK"
                class="text-gray-600"
              />
              <span
                :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.POSTED }"
                class="text-gray-700 font-normal text-sm"
              >Posted</span>
            </div>
          </a-menu-item>
          <a-menu-item key="8" class="h-10 !rounded-none !px-4" @click="handleLeadStatusChange(LeadStatus.PICKED_UP)">
            <div class="flex items-center gap-2">
              <Icon
                :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.PICKED_UP }"
                :icon="Icons.INBOX"
                class="text-gray-600"
              />
              <span
                :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.PICKED_UP }"
                class="text-gray-700 font-normal text-sm"
              >Picked Up</span>
            </div>
          </a-menu-item>
          <a-menu-item key="9" class="h-10 !rounded-none !px-4" @click="handleLeadStatusChange(LeadStatus.DISPATCHED)">
            <div class="flex items-center gap-2">
              <Icon :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.DISPATCHED }" :icon="Icons.SEND" class="text-gray-600" />
              <span :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.DISPATCHED }" class="text-gray-700 font-normal text-sm">Dispatched</span>
            </div>
          </a-menu-item>
          <a-menu-item key="10" class="h-10 !rounded-none !px-4" @click="handleLeadStatusChange(LeadStatus.ARCHIVED)">
            <div class="flex items-center gap-2">
              <Icon :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.ARCHIVED }" :icon="Icons.FOLDER" class="text-gray-600" />
              <span :class="{ 'text-primary-600': filter.leadStatus === LeadStatus.ARCHIVED }" class="text-gray-700 font-normal text-sm">Archived</span>
            </div>
          </a-menu-item>
          <a-menu-item key="11" class="h-10 !rounded-none !px-4 border-t border-gray-100 text-center" @click="resetFilter">
            <span class="text-red-500 font-normal text-sm">Clear Filter</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.filter-btn {
  padding: 0 !important;
}

:global(.ant-input-affix-wrapper.search-box.ant-input-affix-wrapper-lg) {
  background-color: var(--color-gray-50) !important;
  height: 2.5rem !important;
  overflow: hidden !important;
}
</style>
