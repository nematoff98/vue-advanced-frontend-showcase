<script lang="ts" setup>
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import {
  LeadVehicle,
  LeadVehicleServiceInstance, VehicleRequestForm, VehicleType,
} from '@/services/lead-vehicle';
import {
  computed, onMounted, ref, watch,
} from 'vue';
import {
  DictionariesServiceInstance, Vehicle, VehicleMake, VehicleYear,
} from '@/services/dictionaries';
import { Form } from 'vee-validate';
import { SelectOption } from '@/services/general';
import { debounce } from 'lodash';
import { notification } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useErrorNotification } from '@/composables/useErrorNotification';
import VehicleCreateModal from '@/components/ui/VehicleCreateModal.vue';
import { useCurrentUserStore } from '@/stores/useCurrentUser';
import { filterOption } from '@/utils';

const currentUser = useCurrentUserStore();
const { showFormError } = useErrorNotification();

interface Props {
  open: boolean
  title: string
  id?: number
  vehicle?: LeadVehicle
  leadId: number
}

interface Emits {
  (e: 'update:open', open: boolean): void
  (e: 'updateData'): void
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const isLoading = ref(false);
const years = ref<VehicleYear[]>([]);
const makes = ref<VehicleMake[]>([]);
const models = ref<Vehicle[]>([]);
const formState = ref<VehicleRequestForm>({ isRun: true });
const submitLoading = ref(false);
const vinLoading = ref(false);
const vehicleMakesLoading = ref(false);
const vehicleModelLoading = ref(false);
const isCreateModalOpen = ref(false);
const createModalConfig = ref({
  step: 1,
  year: undefined as number | undefined,
  makeYearId: undefined as number | undefined,
  makeName: '',
});

const formRef = ref();

const yearOptions = computed<SelectOption<number>[]>(() => years.value.map((year) => ({
  value: year.year,
  label: year.year.toString(),
})));

const makeOptions = computed<SelectOption<number>[]>(() => makes.value.map((make) => ({
  value: make.id,
  label: make.name,
})));

const modelOptions = computed<SelectOption<number>[]>(() => models.value.map((model) => ({
  value: model.id,
  label: model.originalModel,
})));

const fetchDistinctVehicleYears = async () => {
  try {
    isLoading.value = true;
    years.value = await DictionariesServiceInstance.getVehicleYears();
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDistinctVehicleYears();
});

const fetchDistinctVehicleMakes = async (year?: number, edit?: boolean) => {
  if (!year) {
    formState.value.make = undefined;
    formState.value.vehicleId = undefined;
    return;
  }
  if (!edit) {
    formState.value.make = undefined;
    formState.value.vehicleId = undefined;
  }
  vehicleMakesLoading.value = true;
  try {
    makes.value = await DictionariesServiceInstance.getVehicleMakes(year, props.vehicle?.id);
  } catch (err) {
    console.error(err);
  } finally {
    vehicleMakesLoading.value = false;
  }
};

const fetchDistinctVehicleModels = async (makeYearId?: number, edit?: boolean) => {
  if (!makeYearId) {
    formState.value.vehicleId = undefined;
    return;
  }
  if (!edit) formState.value.vehicleId = undefined;
  try {
    vehicleModelLoading.value = true;
    models.value = await DictionariesServiceInstance.getVehicleModels(+makeYearId, props.vehicle?.id);
  } catch (err) {
    console.error(err);
  } finally {
    vehicleModelLoading.value = false;
  }
};

const fillForm = () => {
  if (props.vehicle) {
    formState.value.year = props.vehicle.year;
    formState.value.make = props.vehicle.vehicleMakeYearId;
    formState.value.vehicleId = props.vehicle.vehicleId;
    formState.value.isRun = props.vehicle.isRun;
    formState.value.vin = props.vehicle.vin;
    formState.value.priceOpen = props.vehicle.priceOpen;
    formState.value.priceEnclosed = props.vehicle.priceEnclosed;
    formState.value.deposit = props.vehicle.deposit;
    formState.value.oceanFee = props.vehicle.oceanFee;
    if (props.vehicle?.year) fetchDistinctVehicleMakes(props.vehicle.year, true);
    if (props.vehicle?.vehicleMakeYearId) fetchDistinctVehicleModels(props.vehicle.vehicleMakeYearId, true);
    // formState.value.premiumPrice = props.vehicle.premiumPrice;
  }
};

watch(() => props.open, (newValue) => {
  if (newValue) fillForm();
  else formState.value = {};
});

const closeModal = () => {
  emit('update:open', false);
};

const createLeadVehicle = async ({ leadId, body }: {leadId: number, body: VehicleRequestForm}) => {
  isLoading.value = true;
  try {
    await LeadVehicleServiceInstance.createLeadVehicle(leadId, body);
    emit('updateData');
    closeModal();
    notification.success({
      message: 'Successfully',
      description: 'Vehicle successfully added',
    });
  } catch (err) {
    if (err) showFormError(formRef.value, err);
  } finally {
    isLoading.value = false;
  }

  return null;
};

const editLeadVehicle = async ({ vehicleId, body }: {vehicleId: number, body: VehicleRequestForm}) => {
  isLoading.value = true;
  if (!props.id) return;
  try {
    await LeadVehicleServiceInstance.editLeadVehicle(vehicleId, body);
    emit('updateData');
    closeModal();
    notification.success({
      message: 'Successfully',
      description: 'Vehicle successfully changed',
    });
  } catch (err) {
    if (err) showFormError(formRef.value, err);
  } finally {
    isLoading.value = false;
  }
};

const onFinish = async () => {
  submitLoading.value = true;
  if (!formState.value.isRun) formState.value.isRun = false;
  if (!props?.vehicle?.id) {
    await createLeadVehicle({ leadId: props.leadId, body: formState.value });
  } else if (props.id) {
    await editLeadVehicle({ vehicleId: props.id, body: formState.value });
  }
  submitLoading.value = false;
};

const startSearchVehicleByVin = debounce(async () => {
  if (!formState.value.vin || formState.value.vin.length < 17) return;
  vinLoading.value = true;
  try {
    const vehicle = await LeadVehicleServiceInstance.getLeadByVin(formState.value.vin);
    formState.value.year = vehicle.year;
    formState.value.make = vehicle.vehicleYearId;
    formState.value.vehicleId = vehicle.id;
    if (vehicle?.year) fetchDistinctVehicleMakes(vehicle.year, true).then();
    if (vehicle?.vehicleYearId) fetchDistinctVehicleModels(vehicle.vehicleYearId, true).then();
  } catch (err) {
    console.error(err);
    formRef.value?.setErrors({ vin: 'Vehicle not found' });
  } finally {
    vinLoading.value = false;
  }
}, 400);

const handleVehicleCreateSuccess = async (data: {
  year?: number;
  makeName: string;
  makeYearId?: number;
  modelName: string;
  vehicleId?: number;
  type?: VehicleType;
}) => {
  formState.value.year = data.year;
  formState.value.make = data.makeYearId;
  formState.value.vehicleId = data.vehicleId;
  if (data.year) years.value = [{ year: data.year }];
  if (data.makeYearId) makes.value = [{ id: data.makeYearId, name: data.makeName }];
  if (data.vehicleId && data.type) {
    models.value = [{
      id: data.vehicleId,
      originalModel: data.modelName,
      type: data.type,
    }];
  }
  await fetchDistinctVehicleYears();
  if (!years.value.find((y) => y.year === data.year) && data.year) {
    years.value.push({ year: data.year });
  }
  formState.value.year = data.year;

  await fetchDistinctVehicleMakes(data.year, true);
  if (!makes.value.find((m) => m.id === data.makeYearId) && data.makeYearId) {
    makes.value.push({ id: data.makeYearId, name: data.makeName });
  }
  formState.value.make = data.makeYearId;

  await fetchDistinctVehicleModels(data.makeYearId, true);
  if (!models.value.find((m) => m.id === data.vehicleId) && data.vehicleId) {
    models.value.push({
      id: data.vehicleId,
      originalModel: data.modelName,
      imageUrl: '',
      type: data.type || '' as VehicleType,
      bodyType: '',
    });
  }
  formState.value.vehicleId = data.vehicleId;
};

const openCreateModal = (step: number) => {
  createModalConfig.value = {
    step,
    year: formState.value.year,
    makeYearId: formState.value.make,
    makeName: makes.value.find((m) => m.id === formState.value.make)?.name || '',
  };
  isCreateModalOpen.value = true;
};
</script>

<template>
  <a-modal
    :footer="null"
    :open="open"
    :title="title"
    :mask-closable="false"
    closable
    width="550px"
    @cancel="closeModal"
  >
    <Form
      ref="formRef"
      class="default-form"
      @submit="onFinish"
    >
      <a-row>
        <a-col :span="24">
          <BaseInput
            name="vin"
            v-model="formState.vin"
            label="VIN"
            rules="min:17"
            show-count
            :maxlength="17"
            placeholder="Enter VIN"
            @update:model-value="startSearchVehicleByVin"
          />
        </a-col>
      </a-row>

      <a-spin :spinning="vinLoading">
        <a-row :gutter="[12, 12]" class="mt-4 mb-6">
          <a-col :span="12">
            <BaseSelect
              v-model="formState.year"
              name="year"
              allow-clear
              label="Vehicle model year"
              show-search
              :filter-option="filterOption"
              placeholder="Select year"
              :options="yearOptions"
              @update:model-value="fetchDistinctVehicleMakes(formState.year)"
            >
              <template #dropdownRender="{ menuNode: menu }">
                <component :is="menu" />
                <a-divider style="margin: 4px 0" />
                <div
                  class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 text-primary-600 font-medium"
                  @mousedown="e => e.preventDefault()"
                  @click="openCreateModal(1)"
                >
                  <PlusOutlined />
                  Add new vehicle
                </div>
              </template>
            </BaseSelect>
          </a-col>
          <a-col :span="12">
            <BaseSelect
              v-model="formState.make"
              :disabled="!formState.year"
              name="make"
              label="Vehicle make"
              allow-clear
              :filter-option="filterOption"
              :loading="vehicleMakesLoading"
              show-search
              placeholder="Select make"
              rules="required"
              :options="makeOptions"
              @update:model-value="fetchDistinctVehicleModels(formState.make)"
            >
              <template #dropdownRender="{ menuNode: menu }">
                <component :is="menu" />
                <a-divider style="margin: 4px 0" />
                <div
                  class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 text-primary-600 font-medium"
                  @mousedown="e => e.preventDefault()"
                  @click="openCreateModal(2)"
                >
                  <PlusOutlined />
                  Add new vehicle
                </div>
              </template>
            </BaseSelect>
          </a-col>

          <a-col :span="12">
            <BaseSelect
              v-model="formState.vehicleId"
              :disabled="!formState.make"
              name="vehicleId"
              show-search
              allow-clear
              label="Vehicle model"
              :loading="vehicleModelLoading"
              :filter-option="filterOption"
              rules="required"
              placeholder="Select model"
              :options="modelOptions"
            >
              <template #dropdownRender="{ menuNode: menu }">
                <component :is="menu" />
                <a-divider style="margin: 4px 0" />
                <div
                  class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 text-primary-600 font-medium"
                  @mousedown="e => e.preventDefault()"
                  @click="openCreateModal(3)"
                >
                  <PlusOutlined />
                  Add new vehicle
                </div>
              </template>
            </BaseSelect>
          </a-col>

          <a-col :span="12">
            <h4 class="block text-gray-700 font-medium text-sm mb-[6px]">
              Vehicle condition<span class="text-primary-600">*</span>
            </h4>
            <a-checkbox
              v-model:checked="formState.isRun"
              class="border border-gray-200 w-full h-11 flex items-center px-4 rounded-xl"
            >
              Vehicle runs & drives
            </a-checkbox>
          </a-col>

          <a-col :span="12">
            <BaseInput
              name="priceOpen"
              v-model="formState.priceOpen"
              label="Price open"
              type="number"
              rules="required"
              placeholder="Enter price"
            />
          </a-col>

          <a-col :span="12">
            <BaseInput
              name="priceEnclosed"
              v-model="formState.priceEnclosed"
              label="Price enclosed"
              rules="required"
              type="number"
              placeholder="Enter price"
            />
          </a-col>

          <a-col :span="12">
            <BaseInput
              name="deposit"
              v-model="formState.deposit"
              label="Deposit"
              type="number"
              rules="required"
              placeholder="Enter deposit"
            />
          </a-col>

          <a-col v-if="currentUser?.currentUser?.hasOrganizationOceanShipping" :span="12">
            <BaseInput
              name="ocean_fee"
              v-model="formState.oceanFee"
              label="Ocean freight price"
              type="number"
              placeholder="Enter Ocean freight"
            />
          </a-col>
        </a-row>
      </a-spin>

      <div class="flex items-center justify-end border-t border-gray-200 pt-3">
        <a-button
          class="bg-gray-50"
          html-type="button"
          type="ghost"
          @click="closeModal"
        >Cancel</a-button>
        <a-button
          html-type="submit"
          type="primary"
          :loading="submitLoading"
        >Ok</a-button>
      </div>
    </Form>
  </a-modal>

  <VehicleCreateModal
    v-model:open="isCreateModalOpen"
    :initial-step="createModalConfig.step"
    :initial-year="createModalConfig.year"
    :initial-make-year-id="createModalConfig.makeYearId"
    :initial-make-name="createModalConfig.makeName"
    @success="handleVehicleCreateSuccess"
  />
</template>
