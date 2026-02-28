<script setup lang="ts">

import { Icons } from '@/components/icon/helpers';
import { PermissionEnum } from '@/utils/permission/enums';
import { h, inject, Ref } from 'vue';
import ChevronsLeftIcon from '@/components/icon/ChevronsLeftIcon.vue';
import Icon from '@/components/icon/Icon.vue';
import BaseThemeSwitch from '@/components/ui/BaseThemeSwitch.vue';
import { Routes } from '@/router/router.links';
import { useCan } from '@/utils/permission/can';

const {
  CHATS, UNKNOWN_CHATS, DASHBOARD, LEADS, FOLLOW_UP, SETTINGS, CARRIERS,
} = Routes;

const $can = useCan();

const collapsed = defineModel('collapse', { type: Boolean });

const isDarkMode = inject('isDarkMode') as Ref<boolean>;
const toggleDarkMode = inject('toggleDarkMode') as (mode?: boolean) => void;
</script>

<template>
  <div class="flex flex-col h-full">
    <RouterLink
      class="p-4 flex border-b border-white border-opacity-10 items-center justify-center w-full text-white hover:text-white"
      :to="CHATS.path"
    >
      <Icon :icon="Icons.LOGO_ICON" class="flex-shrink-0" height="30px" width="40px" />
      <span class="text-[23px]">BeRocker</span>
    </RouterLink>

    <ul
      class="py-4 px-3 flex flex-col gap-2 border-b border-white border-opacity-10"
    >
      <li v-if="$can(PermissionEnum.GET_CHATS_LIST)">
        <RouterLink
          active-class="bg-white bg-opacity-10 text-white dark:hover:bg-white/5 dark:bg-white/10"
          class="w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-white text-opacity-75 hover:text-white hover:bg-white hover:bg-opacity-5 dark:hover:bg-white/5"
          :to="CHATS.path"
        >
          <Icon
            :icon="Icons.MESSAGE_SQUARE_TEXT"
            :size="24"
            class="flex-shrink-0"
          />
          <span>Chats</span>
        <!--            <span-->
        <!--              class="rounded-full flex items-center justify-center bg-primary-600 min-w-[18px] h-[18px] px-1 ms-auto text-xs"-->
        <!--            >-->
        <!--              3-->
        <!--            </span>-->
        </RouterLink>
      </li>
      <li>
        <RouterLink
          active-class="bg-white bg-opacity-10 text-white dark:hover:bg-white/5 dark:bg-white/10"
          class="w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-white text-opacity-75 hover:text-white hover:bg-white hover:bg-opacity-5 dark:hover:bg-white/5"
          :to="DASHBOARD.path"
        >
          <Icon
            :icon="Icons.GRID_ICON"
            :size="20"
            class="flex-shrink-0"
          />
          <span>Dashboard</span>
        </RouterLink>
      </li>
      <li v-if="$can(PermissionEnum.GET_UNKNOWN_CHATS)">
        <RouterLink
          active-class="bg-white bg-opacity-10 text-white dark:hover:bg-white/5 dark:bg-white/10"
          class="w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-white text-opacity-75 hover:text-white hover:bg-white hover:bg-opacity-5 dark:hover:bg-white/5"
          :to="UNKNOWN_CHATS.path"
        >
          <Icon
            :icon="Icons.MESSAGE_SQUARE"
            :size="16"
            class="flex-shrink-0"
          />
          <span>Interactions</span>
        </RouterLink>
      </li>
      <li v-if="$can(PermissionEnum.GET_LEADS_LIST)">
        <RouterLink
          active-class="bg-white bg-opacity-10 text-white dark:hover:bg-white/5 dark:bg-white/10"
          class="w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-white text-opacity-75 hover:text-white hover:bg-white hover:bg-opacity-5 dark:hover:bg-white/5"
          :to="LEADS.path"
        >
          <Icon
            :icon="Icons.USERS"
            :size="20"
            class="flex-shrink-0"
          />
          <span>Leads</span>
        </RouterLink>
      </li>
      <li v-if="$can(PermissionEnum.GET_SCHEDULED_CALLS)">
        <RouterLink
          active-class="bg-white bg-opacity-10 text-white dark:hover:bg-white/5 dark:bg-white/10"
          class="w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-white text-opacity-75 hover:text-white hover:bg-white hover:bg-opacity-5 dark:hover:bg-white/5"
          :to="FOLLOW_UP.path"
        >
          <Icon
            :icon="Icons.CALENDAR"
            :size="20"
            class="flex-shrink-0"
          />
          <span>Follow up</span>
        </RouterLink>
      </li>
      <li
        v-if="$can(PermissionEnum.GET_CARRIERS_LIST)"
      >
        <RouterLink
          active-class="bg-white bg-opacity-10 text-white dark:hover:bg-white/5 dark:bg-white/10"
          class="w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-white text-opacity-75 hover:text-white hover:bg-white hover:bg-opacity-5 dark:hover:bg-white/5"
          :to="CARRIERS.path"
        >
          <Icon
            :icon="Icons.TRUCK"
            :size="20"
            class="flex-shrink-0"
          />
          <span>Carriers</span>
        </RouterLink>
      </li>
    </ul>
    <ul class="py-4 px-3 flex flex-col gap-2 border-b border-[#FFFFFF1A] flex-1">
      <li>
        <RouterLink
          active-class="bg-white bg-opacity-10 text-white dark:hover:bg-white/5 dark:bg-white/10"
          class="w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-white text-opacity-75 hover:text-white hover:bg-white hover:bg-opacity-5 dark:hover:bg-white/5"
          :to="SETTINGS.path"
        >
          <Icon
            :icon="Icons.SETTINGS"
            :size="20"
            class="flex-shrink-0"
          />
          <span>Settings</span>
        </RouterLink>
      </li>
    </ul>
    <div class="flex items-center gap-2 justify-center pt-4 pb-3.5 px-[18px] cursor-pointer">
      <BaseThemeSwitch :model-value="isDarkMode" @update:modelValue="toggleDarkMode" />
      <span v-if="!collapsed" class="text-[#FFFFFFD9]" @click="toggleDarkMode(!isDarkMode)">{{ isDarkMode ? 'Dark mode' : 'Light mode' }}</span>
    </div>
    <div class="flex justify-center pb-3 pt-3 border-t border-[#FFFFFF1A]">
      <a
        href="https://help.berocker.com"
        target="_blank"
        rel="noopener noreferrer"
        class="text-white flex items-center"
        :class="{ 'gap-5': collapse }"
      >
        <span v-if="!collapsed">Help Center</span>
        <Icon :icon="Icons.EXTERNAL_LINK" />
      </a>
    </div>
    <a-button
      :icon="h(ChevronsLeftIcon)"
      class="collapse-trigger flex text-white max-[540px]:hidden"
      @click="collapsed = !collapsed"
    />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/styles/layout/sidebar";
</style>
