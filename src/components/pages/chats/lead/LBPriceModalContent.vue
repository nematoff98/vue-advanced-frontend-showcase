<script lang="ts" setup>
import {
  computed, onMounted, ref, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import {
  BeRockerAiPrice, LoadBoardPrice, SuperDispatchPrice, LoadBoardServiceInstance,
} from '@/services/loadboard';
import { LoadBoard, loadBoardTextMap } from '@/services/driver';
import { moneyFormat } from '@/utils';
import { PermissionEnum } from '@/utils/permission/enums';
import { useCan } from '@/utils/permission/can';
import { useCurrentUserStore } from '@/stores/useCurrentUser';
import { LeadVehicleServiceInstance, VehicleRequestForm } from '@/services/lead-vehicle';
import { notification } from 'ant-design-vue';
import { useErrorNotification } from '@/composables/useErrorNotification';

const { currentUser } = useCurrentUserStore();
const route = useRoute();
const $can = useCan();
const { showErrorNotification } = useErrorNotification();

interface Props {
  open: boolean;
}

interface Emits {
  (e: 'update:vehicle'): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const tabs = computed(() => [
  {
    id: LoadBoard.AI_PRICE,
    text: loadBoardTextMap[LoadBoard.AI_PRICE],
    permission: true,
  },
  {
    id: LoadBoard.SUPER_DISPATCH,
    text: loadBoardTextMap[LoadBoard.SUPER_DISPATCH],
    permission: $can(PermissionEnum.GET_SD_PRICE),
  },
  {
    id: LoadBoard.CENTRAL_DISPATCH,
    text: loadBoardTextMap[LoadBoard.CENTRAL_DISPATCH],
    permission: $can(PermissionEnum.GET_CD_PRICE),
  },
]);

const isLoading = ref<Record<LoadBoard, boolean>>({
  [LoadBoard.SUPER_DISPATCH]: false,
  [LoadBoard.CENTRAL_DISPATCH]: false,
  [LoadBoard.AI_PRICE]: false,
});
const activeTab = ref(LoadBoard.AI_PRICE);
const isSetLoading = ref(false);
const prices = ref<Record<LoadBoard, LoadBoardPrice[] | BeRockerAiPrice[] | null>>({
  [LoadBoard.SUPER_DISPATCH]: null,
  [LoadBoard.CENTRAL_DISPATCH]: null,
  [LoadBoard.AI_PRICE]: null,
});

const superDispatchPrice = ref<SuperDispatchPrice>();

const leadId = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const isShowWarning = computed(() => {
  if (activeTab.value === LoadBoard.AI_PRICE) return false;
  if (activeTab.value === LoadBoard.SUPER_DISPATCH && !currentUser?.priceAccess?.supperDispatch) return true;
  return (activeTab.value === LoadBoard.CENTRAL_DISPATCH && !currentUser?.priceAccess?.centralDispatch);
});

const fetchSuperDispatch = async (lId: number) => {
  if (superDispatchPrice.value) return;
  isLoading.value[LoadBoard.SUPER_DISPATCH] = true;
  try {
    superDispatchPrice.value = await LoadBoardServiceInstance.getSuperDispatch(lId);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value[LoadBoard.SUPER_DISPATCH] = false;
  }
};

// const fetchCentralDispatch = async (lId: number) => {
//   if (isLoading.value[LoadBoard.CENTRAL_DISPATCH]) return;
//   isLoading.value[LoadBoard.CENTRAL_DISPATCH] = true;
//   try {
//     prices.value[LoadBoard.CENTRAL_DISPATCH] = await LoadBoardServiceInstance.getCentralDispatch(lId);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     isLoading.value[LoadBoard.CENTRAL_DISPATCH] = false;
//   }
// };

const fetchAiBrokerPrice = async (lId: number) => {
  if (isLoading.value[LoadBoard.AI_PRICE]) return;
  isLoading.value[LoadBoard.AI_PRICE] = true;
  try {
    prices.value[LoadBoard.AI_PRICE] = await LoadBoardServiceInstance.getBeRockerAiPrice(lId);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value[LoadBoard.AI_PRICE] = false;
  }
};

watch(() => activeTab.value, () => {
  if (!leadId.value || !props.open) return;

  if (prices.value[activeTab.value]) return;
  if (activeTab.value === LoadBoard.SUPER_DISPATCH && currentUser?.priceAccess?.supperDispatch) fetchSuperDispatch(leadId.value);
  if (activeTab.value === LoadBoard.AI_PRICE) fetchAiBrokerPrice(leadId.value);
  // else fetchCentralDispatch(leadId.value);
});

watch(() => props.open, (newValue) => {
  if (newValue && leadId.value) fetchAiBrokerPrice(leadId.value);
  if (!newValue) {
    prices.value = {
      [LoadBoard.SUPER_DISPATCH]: null,
      [LoadBoard.CENTRAL_DISPATCH]: null,
      [LoadBoard.AI_PRICE]: null,
    };
    activeTab.value = LoadBoard.AI_PRICE;
    superDispatchPrice.value = undefined;
  }
});

onMounted(() => {
  if (leadId.value) fetchAiBrokerPrice(leadId.value);
  // if (!$can(PermissionEnum.GET_SD_PRICE)) activeTab.value = LoadBoard.CENTRAL_DISPATCH;
});

const editLeadVehicle = async ({ vehicleId, body, isLast }: {vehicleId: number, body: VehicleRequestForm, isLast:boolean}) => {
  isSetLoading.value = true;
  try {
    await LeadVehicleServiceInstance.editLeadVehicle(vehicleId, body);
    if (isLast) {
      emits('update:vehicle');
      notification.success({
        message: 'Successfully',
        description: 'Vehicle successfully changed',
      });
    }
  } catch (err) {
    showErrorNotification(err);
  } finally {
    isSetLoading.value = false;
  }
};

const setVehiclePrices = () => {
  if (activeTab.value !== LoadBoard.AI_PRICE) return;

  const aiPrices = prices.value[LoadBoard.AI_PRICE] as BeRockerAiPrice[];

  aiPrices.forEach((vehicle, index) => {
    const body = {
      isRun: vehicle.is_run,
      deposit: vehicle.deposit,
      priceEnclosed: vehicle.total_enclosed,
      priceOpen: vehicle.total_open,
    } as VehicleRequestForm;
    if (vehicle.ocean_fee) body.oceanFee = vehicle.ocean_fee;
    editLeadVehicle({
      vehicleId: vehicle.vehicle_id,
      body,
      isLast: index === aiPrices.length - 1,
    });
  });
};

const setSuperDispatchVehiclePrices = () => {
  if (activeTab.value !== LoadBoard.SUPER_DISPATCH || !superDispatchPrice.value?.vehicles?.length) return;

  const { vehicles } = superDispatchPrice.value;
  vehicles.forEach((vehicle, index) => {
    const body: VehicleRequestForm = {
      deposit: vehicle.deposit,
      priceEnclosed: vehicle.price_enclosed,
      priceOpen: vehicle.price_open,
    };
    if (vehicle.ocean_fee) body.oceanFee = vehicle.ocean_fee;
    editLeadVehicle({
      vehicleId: vehicle.vehicle_id,
      body,
      isLast: index === vehicles.length - 1,
    });
  });
};

const aiPrices = computed(() => {
  const tabPrices = prices.value[LoadBoard.AI_PRICE];
  return Array.isArray(tabPrices) ? (tabPrices as BeRockerAiPrice[]) : [];
});

const formatPerMile = (value?: string | number) => {
  if (value === undefined || value === null || value === '') return '-';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '-';
  return `$ ${numeric.toFixed(2)} / mi`;
};

// const totalPrice = computed(() => prices.value[activeTab.value]?.reduce((sum, item) => sum + +item.price, 0) || 0);
// const averagePrice = computed(() => {
//   const items = prices.value[activeTab.value] as LoadBoardPrice[];
//   if (!items || items.length === 0) return 0;
//
//   const total = items.reduce((sum, item) => sum + +item.price, 0);
//   return Math.ceil(total / items.length);
// });

</script>

<template>
  <a-tabs v-model:activeKey="activeTab" class="tab-button w-full">
    <a-tab-pane
      v-for="tab in tabs"
      :key="tab.id"
      :tab="tab.text"
      :disabled="!tab.permission"
    >
      <a-spin :spinning="isLoading[activeTab]">
        <div
          :class="{ 'min-h-[100px]': !isShowWarning }"
        >
          <div
            v-if="LoadBoard.AI_PRICE === activeTab"
            class="mt-4"
          >
            <div
              v-if="!isLoading[activeTab] && aiPrices.length"
            >
              <div
                v-for="(item, i) in aiPrices"
                :key="`ai-price-${item.vehicle_id ?? i}`"
                class="mb-6"
              >
                <!-- Vehicle name outside of table -->
                <h3 class="text-lg font-semibold text-gray-800 mb-2">
                  {{ item.vehicle }}
                </h3>

                <table class="w-full border border-gray-200 rounded-lg">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="p-2 text-left">Type</th>
                      <th class="p-2 text-center">Open</th>
                      <th class="p-2 text-center">Enclosed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Carrier fee -->
                    <tr>
                      <td class="p-2">Carrier fee</td>
                      <td class="p-2 text-center">{{ moneyFormat(item.open) }}</td>
                      <td class="p-2 text-center">{{ moneyFormat(item.enclosed) }}</td>
                    </tr>

                    <!-- Ocean freight -->
                    <tr v-if="currentUser?.hasOrganizationOceanShipping">
                      <td class="p-2">Ocean freight</td>
                      <td class="p-2 text-center">{{ moneyFormat(item.ocean_fee) }}</td>
                      <td class="p-2 text-center">{{ moneyFormat(item.ocean_fee) }}</td>
                    </tr>

                    <!-- Deposit -->
                    <tr>
                      <td class="p-2">Deposit</td>
                      <td class="p-2 text-center">{{ moneyFormat(item.deposit) }}</td>
                      <td class="p-2 text-center">{{ moneyFormat(item.deposit) }}</td>
                    </tr>

                    <!-- Totals -->
                    <tr class="bg-gray-50 font-bold text-lg">
                      <td class="p-2">Total</td>
                      <td class="p-2 text-center">{{ moneyFormat(item.total_open) }}</td>
                      <td class="p-2 text-center">{{ moneyFormat(item.total_enclosed) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex justify-end">
                <a-button
                  type="primary"
                  :loading="isSetLoading"
                  @click="setVehiclePrices"
                >
                  Apply prices to lead
                </a-button>
              </div>
            </div>
            <a-empty v-else />
          </div>
          <div
            v-else-if="LoadBoard.SUPER_DISPATCH === activeTab && currentUser?.priceAccess?.supperDispatch"
            class="mt-4"
          >
            <div
              v-if="superDispatchPrice
                && !isLoading[activeTab]
                && superDispatchPrice.vehicles?.length"
            >
              <div class="text-sm text-gray-500 mb-3">
                Super Dispatch pricing
                <span v-if="superDispatchPrice.price_per_mile" class="ml-2">
                  ({{ formatPerMile(superDispatchPrice.price_per_mile) }} per mile)
                </span>
              </div>
              <div
                v-for="(vehicle, i) in superDispatchPrice.vehicles"
                :key="`sd-vehicle-${vehicle.vehicle_id ?? i}`"
                class="mb-6"
              >
                <h3 class="text-lg font-semibold text-gray-800 mb-2">
                  {{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}
                </h3>

                <table class="w-full border border-gray-200 rounded-lg">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="p-2 text-left">Type</th>
                      <th class="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="p-2">Carrier fee</td>
                      <td class="p-2 text-right">{{ moneyFormat(superDispatchPrice.price) }}</td>
                    </tr>
                    <tr v-if="currentUser?.hasOrganizationOceanShipping">
                      <td class="p-2">Ocean freight</td>
                      <td class="p-2 text-right">{{ moneyFormat(vehicle.ocean_fee) }}</td>
                    </tr>
                    <tr>
                      <td class="p-2">Deposit</td>
                      <td class="p-2 text-right">{{ moneyFormat(vehicle.deposit) }}</td>
                    </tr>
                    <tr>
                      <td class="p-2">Total Open</td>
                      <td class="p-2 text-right">{{ moneyFormat(vehicle.price_open) }}</td>
                    </tr>
                    <tr class="bg-gray-50 font-bold">
                      <td class="p-2">Total Enclosed</td>
                      <td class="p-2 text-right">{{ moneyFormat(vehicle.price_enclosed) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex justify-end">
                <a-button
                  type="primary"
                  :loading="isSetLoading"
                  @click="setSuperDispatchVehiclePrices"
                >
                  Apply prices to lead
                </a-button>
              </div>
            </div>
            <a-empty v-else />
          </div>
        </div>
      </a-spin>
      <a-alert
        type="warning"
        class="mt-6"
        v-if="activeTab === LoadBoard.CENTRAL_DISPATCH && isShowWarning"
      >
        <template #message>
          To access pricing via API on Central Dispatch, you need to request special access.
          Learn more on the <a
            href="https://www.centraldispatch.com/plans"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-500 underline"
          >
            Central Dispatch
          </a> pricing page.
        </template>
      </a-alert>
      <a-alert
        type="warning"
        class="mt-6"
        v-if="activeTab === LoadBoard.SUPER_DISPATCH && isShowWarning"
      >
        <template #message>
          To access pricing via API on Super Dispatch, you also need special access.
          Learn more on the <a
            href="https://superdispatch.com/pricing-insights-api/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-500 underline"
          >
            Super Dispatch
          </a> pricing page.
        </template>
      </a-alert>
    </a-tab-pane>
  </a-tabs>
</template>

<style lang="scss" scoped>
</style>
