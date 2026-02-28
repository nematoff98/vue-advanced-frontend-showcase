<script lang="ts" setup>
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import { onMounted, ref } from 'vue';
import { ChatFullInfo, ChatResponsible, ChatServiceInstance } from '@/services/chat';
import { useRoute } from 'vue-router';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { Grid } from 'ant-design-vue';

const { useBreakpoint } = Grid;
const screens = useBreakpoint();

const route = useRoute();
const $can = useCan();

interface ChatItemHeaderControlProps {
  activeChat?: ChatFullInfo
}

interface Emits {
  (event: 'change-ai'): void
  (event: 'show-lead-info'): void
}

const props = defineProps<ChatItemHeaderControlProps>();
const emits = defineEmits<Emits>();

const reminder = ref(false);
const ai = ref(false);
const reminderLoading = ref(false);
const responsibleLoading = ref(false);

const changeAiResponsible = async () => {
  const { chatId } = route.query;
  if (!chatId) return;
  responsibleLoading.value = true;
  try {
    await ChatServiceInstance.changeResponsibleAi(+chatId);
    emits('change-ai');
  } catch (err) {
    ai.value = !ai.value;
    console.error(err);
  } finally {
    responsibleLoading.value = false;
  }
};

const changeReminder = async () => {
  const { chatId } = route.query;
  if (!chatId) return;
  reminderLoading.value = true;
  try {
    await ChatServiceInstance.changeReminder(+chatId);
  } catch (err) {
    reminder.value = !reminder.value;
    console.error(err);
  } finally {
    reminderLoading.value = false;
  }
};

onMounted(() => {
  ai.value = props.activeChat?.responsible === ChatResponsible.AI;
  reminder.value = !!props.activeChat?.isReminderEnabled;
});
</script>

<template>
  <div class="items-center ml-3 hidden xl:flex max-[1400px]:justify-end max-[1400px]:w-full">
    <div v-if="$can(PermissionEnum.SWITCH_RESPONSIBLE)" class="flex items-center px-3 py-[5px] border border-gray-200 rounded-lg">
      <p class="text-xs dark:text-white">AI</p>
      <a-switch
        v-model:checked="ai"
        class="ml-2"
        :loading="responsibleLoading"
        @change="changeAiResponsible"
      />
    </div>
    <div v-if="$can(PermissionEnum.SWITCH_REMINDER)" class="flex items-center px-3 py-[5px] border border-gray-200 rounded-lg ml-2">
      <p class="text-xs dark:text-white">Reminder</p>
      <a-switch
        v-model:checked="reminder"
        class="ml-2"
        :loading="reminderLoading"
        @change="changeReminder"
      />
    </div>
  </div>

  <div class="flex justify-end w-full min-[1280px]:hidden">
    <a-popover title="" trigger="click">
      <template #content>
        <div v-if="$can(PermissionEnum.SWITCH_RESPONSIBLE)" class="flex items-center px-3 py-[5px] border border-gray-200 rounded-lg">
          <a-switch
            v-model:checked="ai"
            class="mr-2"
            :loading="responsibleLoading"
            @change="changeAiResponsible"
          />
          <p class="text-xs">AI</p>
        </div>
        <div v-if="$can(PermissionEnum.SWITCH_REMINDER)" class="flex items-center px-3 py-[5px] border border-gray-200 rounded-lg mt-2">
          <a-switch
            v-model:checked="reminder"
            class="mr-2"
            :loading="reminderLoading"
            @change="changeReminder"
          />
          <p class="text-xs">Reminder</p>
        </div>
      </template>
      <button
        v-if="[$can(PermissionEnum.SWITCH_REMINDER), $can(PermissionEnum.SWITCH_RESPONSIBLE)]"
        class="w-8 h-8 bg-gray-50 rounded-lg min-w-8 flex items-center justify-center ml-1"
        type="button"
      >
        <Icon :icon="Icons.DOTS_VERTICAL" size="14" />
      </button>
    </a-popover>
    <button
      v-if="!screens?.xxl && !screens?.xl"
      class="w-8 h-8 bg-gray-50 rounded-lg min-w-8 flex items-center justify-center ml-1"
      type="button"
      @click="emits('show-lead-info')"
    >
      <Icon :icon="Icons.INFO" size="16" />
    </button>
  </div>
<!--  <button-->
<!--    class="ml-2 w-8 h-8 bg-gray-50 rounded-lg min-w-8 flex items-center justify-center"-->
<!--    type="button"-->
<!--    @click="toggleVisibility"-->
<!--  >-->
<!--    <Icon :icon="Icons.INFO" />-->
<!--  </button>-->
</template>

<style lang="scss" scoped>

</style>
