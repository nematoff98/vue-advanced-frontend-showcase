<script lang="ts" setup>
import ChatLeadStatusUpdate from '@/components/pages/chats/lead/ChatLeadStatusUpdate.vue';
import ChatEnclosedButton from '@/components/pages/chats/ChatEnclosedButton.vue';
import ChatOpenLBPrice from '@/components/pages/chats/lead/ChatOpenLBPrice.vue';
import ChatAgreeButton from '@/components/pages/chats/ChatAgreeButton.vue';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { FullLeadInfo } from '@/services/lead';
import { moneyFormat } from '@/utils';
import { useCurrentUserStore } from '@/stores/useCurrentUser';
import ChatLeadReassign from '@/components/pages/chats/lead/ChatLeadReassign.vue';
import { ChatFullInfo } from '@/services/chat';

const currentUser = useCurrentUserStore();

interface ChatLeadInfoProps {
  lead?: FullLeadInfo
  loading?: boolean
  chatFullInfo?: ChatFullInfo
}

interface ChatLeadInfoEmits {
  (e: 'updateLead'): void
  (e: 'update:vehicle'): void;
}

defineProps<ChatLeadInfoProps>();
const emits = defineEmits<ChatLeadInfoEmits>();

</script>

<template>
  <a-spin :spinning="loading">
    <div class="bg-white rounded-2xl p-3 min-h-[258px] mt-4">
      <article v-if="lead" class="">
        <a-descriptions class="description pb-1">
          <template #title>
            <h2 class="text-gray-700 mr-auto text-xs" style="font-weight: bold">Lead Info</h2>
          </template>
          <template #extra>
            <div class="flex items-center justify-end gap-1">
              <div class="flex items-center gap-0.5 bg-red-100 rounded-[50px] w-max py-1 px-2 text-red-600 text-xxs font-medium">
                <Icon :icon="Icons.HOT_SALE" size="10" />
                <span>Hot</span>
              </div>
              <ChatLeadStatusUpdate
                :lead="lead"
                @updateLead="emits('updateLead')"
              />
            </div>
          </template>
          <a-descriptions-item :span="3" class="description-item">
            <template #label>
              <span class="text-gray-700 font-medium">Open price</span>
            </template>
            <span class="flex-grow border-b border-dashed mb-1 border-gray-100 mx-1.5" />
            <span class="text-base text-gray-600 font-bold">
              {{ moneyFormat(lead.priceOpen) }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :span="3" class="description-item">
            <template #label>
              <span class="text-gray-700 font-medium">Enclose price</span>
            </template>
            <span class="flex-grow border-b border-dashed mb-1 border-gray-100 mx-1.5" />
            <span class="text-base text-gray-600 font-bold">
              {{ moneyFormat(+lead.priceEnclosed) }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :span="3" class="description-item">
            <template #label>
              <span class="text-gray-700 font-medium">Deposit</span>
            </template>
            <span class="flex-grow border-b border-dashed mb-1 border-gray-100 mx-1.5" />
            <span class="text-base text-primary-600 font-bold">
              {{ moneyFormat(+lead.deposit) }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item
            v-if="currentUser?.currentUser?.hasOrganizationOceanShipping"
            :span="3"
            class="description-item"
          >
            <template #label>
              <span class="text-gray-700 font-medium">Ocean freight</span>
            </template>
            <span class="flex-grow border-b border-dashed mb-1 border-gray-100 mx-1.5" />
            <span class="text-base text-primary-600 font-bold">
              {{ moneyFormat(+lead.oceanFee) }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :span="3" class="description-item">
            <template #label>
              <span class="text-gray-700 font-medium">Price per mile</span>
            </template>
            <span class="flex-grow border-b border-dashed mb-1 border-gray-100 mx-1.5" />
            <span class="text-base text-gray-400 font-bold">
              {{ moneyFormat(lead.pricePerMile) }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :span="3" class="description-item">
            <template #label>
              <span class="text-gray-700 font-medium">Lead source</span>
            </template>
            <span class="flex-grow border-b border-dashed mb-1 border-gray-100 mx-1.5" />
            <span class="text-sm text-gray-600 font-bold">{{lead.leadProvider}}</span>
          </a-descriptions-item>
        </a-descriptions>

        <div class="grid grid-cols-2 gap-2 mb-2">
          <ChatAgreeButton
            :lead="lead"
            @updateLead="emits('updateLead')"
          />
          <ChatEnclosedButton
            :lead="lead"
            @updateLead="emits('updateLead')"
          />

        </div>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <ChatOpenLBPrice
            @update:vehicle="emits('update:vehicle')"
          />
          <ChatLeadReassign
            :chat-full-info="chatFullInfo"
            :lead="lead"
          />
        </div>
      </article>
    </div>
  </a-spin>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/ui/chat-lead-info';

</style>
