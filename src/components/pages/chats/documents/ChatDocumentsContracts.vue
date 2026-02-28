<script lang="ts" setup>
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import ClientVisitHistoryModal from '@/components/pages/chats/documents/ClientVisitHistoryModal.vue';
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { LeadContract, LeadContractServiceInstance } from '@/services/lead-contract';
import { addSuccess, formattedDate } from '@/utils';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import { FullLeadInfo } from '@/services/lead';
import CopyableText from '@/components/ui/copyable-text/CopyableText.vue';
import { CopyableTextType } from '@/components/ui/copyable-text/helpers';

const route = useRoute();
const $can = useCan();

interface Props {
  activeLead?: FullLeadInfo
}

defineProps<Props>();

const isLoading = ref(false);
const deleteLoading = ref(false);
const contracts = ref<LeadContract[]>([]);

const id = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const contract = computed(() => contracts.value[0]);

const signedAt = computed(() => (contract.value ? formattedDate(contract.value.signedAt, 'MMM DD, HH:mm') : ''));

const fetchLeadContracts = async (leadId: number) => {
  isLoading.value = true;
  try {
    contracts.value = await LeadContractServiceInstance.getLeadContracts(leadId);
  } catch (err) {
    isLoading.value = false;
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const deleteLeadContract = async (contractId: number) => {
  deleteLoading.value = true;
  try {
    await LeadContractServiceInstance.deleteLeadContract(contractId);
    addSuccess('Contract deleted successfully');
    if (id.value) await fetchLeadContracts(id.value);
  } catch (err) {
    console.error(err);
  } finally {
    deleteLoading.value = false;
  }
};

watchEffect(() => {
  if (id.value) fetchLeadContracts(id.value);
});

const modalOpen = ref<boolean>(false);

const openContractLink = () => {
  if (contract.value?.contractLink) {
    window.open(contract.value.contractLink, '_blank');
  }
};

</script>

<template>
  <a-spin :spinning="isLoading">
    <div class="bg-white rounded-xl p-3 min-h-[70px]">
      <article v-if="contract">
        <a-descriptions>
          <template #title>
            <CopyableText
              text="Contract"
              text-class="font-bold text-gray-700 text-base"
              :value="contract.contractLink"
            />
          </template>
          <a-descriptions-item :span="3" class="description-item">
            <template #label>
              <div class="flex items-center gap-1.5">
                <Icon :icon="Icons.MONITOR" class="text-gray-400" />
                <span class="text-gray-700 font-medium">{{ contract.signerIp }}</span>
              </div>
            </template>
            <span class="text-gray-400 font-medium ms-auto">{{ signedAt }}</span>
          </a-descriptions-item>
          <a-descriptions-item :span="3" class="description-item">
            <template #label>
              <div class="flex items-center gap-1.5">
                <Icon :icon="Icons.USER" class="text-gray-400" />
                <span class="text-gray-700 font-medium">{{ contract.signerName }}</span>
              </div>
            </template>
          </a-descriptions-item>
          <a-descriptions-item :span="3" class="description-item">
            <template #label>
              <div class="flex items-center gap-1.5">
                <Icon :icon="Icons.EMAIL" class="text-gray-400" />
                <span class="text-gray-700 font-medium">{{ contract.signerEmail }}</span>
              </div>
            </template>
          </a-descriptions-item>
        </a-descriptions>
        <a-button
          v-if="$can(PermissionEnum.GET_LEAD_VISITS)"
          class="bg-gray-100 text-gray-700 w-full text-center mb-2"
          size="small"
          type="ghost"
          @click="modalOpen = true"
        >Show history
        </a-button>
        <div class="grid grid-cols-2 gap-1">
          <a-button
            size="small"
            type="primary"
            @click="openContractLink"
          >View
          </a-button>
          <a-popconfirm
            title="Are you sure delete this contract?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteLeadContract(+contract.id)"
          >
            <a-button
              v-if="$can(PermissionEnum.DELETE_LEAD_CONTRACTS)"
              class="bg-red-400 text-white"
              size="small"
              type="ghost"
              :loading="deleteLoading"
            >
              Delete
            </a-button>
          </a-popconfirm>
        </div>
        <ClientVisitHistoryModal v-if="id" v-model:open="modalOpen" :leadId="id" />
      </article>
      <div v-else-if="!isLoading && !contract">
        <div v-if="activeLead?.contractLink" class="flex items-center">
          <CopyableText
            text="Contract link"
            :value="activeLead.contractLink"
            :type="CopyableTextType.EXTERNAL_LINK"
            text-class="text-primary"
          />
        </div>
        <div v-if="activeLead?.bookingLink" class="flex items-center mt-3">
          <CopyableText
            text="Booking link"
            :value="activeLead.bookingLink"
            :type="CopyableTextType.EXTERNAL_LINK"
            text-class="text-primary"
          />
        </div>
      </div>
    </div>
  </a-spin>
</template>

<style lang="scss" scoped>

</style>
