<script setup lang="ts">
import { UserListWithoutPagination, UserServiceInstance } from '@/services/user';
import { computed, ref, watch } from 'vue';
import { FullLeadInfo, LeadServiceInstance } from '@/services/lead';
import { useRoute, useRouter } from 'vue-router';
import { addSuccess } from '@/utils';
import { Routes } from '@/router/router.links';
import { ChatFullInfo } from '@/services/chat';
import { useChatStore } from '@/stores/useChatStore';

const { CHATS } = Routes;
const chatStore = useChatStore();

interface Props {
  chatFullInfo?: ChatFullInfo
  lead?: FullLeadInfo
}

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();

const show = defineModel('open', { type: Boolean, default: false });

const getUsersLoading = ref(false);
const isCreateLoading = ref(false);
const userOptions = ref<UserListWithoutPagination[]>([]);
const userId = ref<number>();

const getUsers = async () => {
  getUsersLoading.value = true;
  try {
    userOptions.value = await UserServiceInstance.getUsersWithoutPagination();
  } catch (err) {
    console.error(err);
  } finally {
    getUsersLoading.value = false;
  }
};

const save = async () => {
  isCreateLoading.value = true;
  const { leadId } = route.query;
  if (!leadId || !userId.value) return;
  try {
    await LeadServiceInstance.leadReassign(+leadId, userId.value);
    show.value = false;
    addSuccess('Reassignment saved successfully');
    if (!props.chatFullInfo || !props.chatFullInfo.leadId) return;
    chatStore.removeChatFromChats(
      props.chatFullInfo.id,
      props.chatFullInfo.leadId,
      props.chatFullInfo.responsible,
    );
    await router.replace(CHATS.path);
  } catch (err) {
    console.error(err);
  } finally {
    isCreateLoading.value = false;
  }
};

const users = computed(() => {
  if (props.lead?.userId) return userOptions.value.filter((p) => p.id !== props.lead?.userId);
  return userOptions.value;
});

watch(() => show.value, (newValue) => {
  if (newValue) {
    getUsers();
  }
});
</script>

<template>
  <a-modal
    :open="show"
    title="Reassign lead"
    :mask-closable="false"
    closable
    :width="800"
    @cancel="show = false"
    :footer="null"
  >
    <a-spin
      :spinning="getUsersLoading"
    >
      <div
        class="min-h-10"
      >
        <a-alert type="warning">
          <template #message>
            <strong class="font-bold">Warning!</strong> When you reassign a lead to another user, the lead’s contact settings will also switch to the new user.
            The client will start receiving messages <span class="font-bold">from the new user,</span>
            and it will appear to them as if the messages are coming <span class="font-bold">from a different number/sender.</span>
            <br>
            Please make sure you understand this before proceeding.
          </template>
        </a-alert>
        <div class="max-h-[400px] overflow-y-auto">
          <a-radio-group
            v-model:value="userId"
            class="w-full grid grid-cols-2 gap-2 mb-2 mt-4"
          >
            <a-radio
              v-for="user in users"
              :key="user.id"
              :value="user.id"
              class="block border my-1 px-3 py-1 rounded"
            >{{ user.name }}</a-radio>
          </a-radio-group>
        </div>
      </div>
    </a-spin>
    <div class="flex items-center justify-end pt-3 border-t border-gray-200 mt-3">
      <a-button
        class="border-none bg-gray-50 text-gray-700 h-10"
        @click="show = false"
      >
        Cancel
      </a-button>
      <a-button
        :loading="isCreateLoading"
        class="h-10"
        type="primary"
        @click="save"
      >
        Reassign
      </a-button>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
