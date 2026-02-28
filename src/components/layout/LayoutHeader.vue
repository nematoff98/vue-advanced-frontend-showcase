<script setup lang="ts">
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { useRoute } from 'vue-router';
import { useCurrentUserStore } from '@/stores/useCurrentUser';
import { Routes } from '@/router/router.links';
import { ref } from 'vue';
import { Grid } from 'ant-design-vue';

const { useBreakpoint } = Grid;
const screens = useBreakpoint();

const route = useRoute();
const user = useCurrentUserStore();

interface Emits {
  (e: 'open-sidebar'): void
}

const emits = defineEmits<Emits>();

const isGlobalSearchOpen = ref(false);
const openCallsDropdown = ref<boolean>(false);
const {
  SETTINGS_PROFILE,
} = Routes;

const closeCallsDropdown = () => {
  openCallsDropdown.value = false;
};
</script>

<template>
  <a-layout-header class="header z-10 sticky top-0 gap-6">
    <div class="flex items-center flex-1 gap-6">
      <div class="flex items-center gap-4">
        <Icon :icon="Icons.LIST" size="18" class="min-[540px]:hidden" @click="emits('open-sidebar')" />
        <h1 v-if="route.meta.title" class="text-gray-700 text-base font-bold">{{ route.meta.title }}</h1>
      </div>
      <a-alert v-if="user.currentUser?.contactsNotAdded && !screens?.xs" type="warning" show-icon>
        <template #message>
          Your account setup is incomplete. Please
          <RouterLink class="underline text-primary-600 hover:text-primary-500" :to="SETTINGS_PROFILE.path">
            add your default contact details
          </RouterLink>
          to proceed efficiently.
        </template>
      </a-alert>
    </div>
    <div v-if="!screens?.xs" class="flex items-center gap-4">
      <div class="flex items-center gap-3 pr-4 border-r border-gray-100">
        <a-button class="btn-m btn-square btn-gray" @click="isGlobalSearchOpen = true">
          <Icon :icon="Icons.SEARCH" size="20px" />
        </a-button>
        <a-badge v-click-outside="closeCallsDropdown" :overflow-count="9" color="blue">
          <a-button class="btn-m btn-square btn-gray" @click="openCallsDropdown = true">
            <Icon :icon="Icons.PHONE" size="20px" />
          </a-button>
        </a-badge>
      </div>
    </div>
  </a-layout-header>
</template>

<style scoped lang="scss">

</style>
