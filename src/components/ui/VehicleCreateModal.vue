<script lang="ts" setup>
import {
  ref, onMounted, computed, watch,
} from 'vue';
import { Form } from 'vee-validate';
import { notification } from 'ant-design-vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import { DictionariesServiceInstance, Vehicle, VehicleMake } from '@/services/dictionaries';
import { useErrorNotification } from '@/composables/useErrorNotification';
import { PlusOutlined } from '@ant-design/icons-vue';
import { VehicleType } from '@/services/lead-vehicle';

interface Props {
  open: boolean;
  initialStep?: number;
  initialYear?: number;
  initialMakeYearId?: number;
  initialMakeName?: string;
}

interface FormStateType {
  year?: number;
  makeName: string;
  makeYearId?: number;
  modelName: string;
  vehicleId?: number;
  type?: VehicleType;
}

interface Emits {
  (e: 'update:open', open: boolean): void;
  (e: 'success', data: FormStateType): void;
}

const props = withDefaults(defineProps<Props>(), {
  initialStep: 1,
});
const emit = defineEmits<Emits>();

const { showFormError } = useErrorNotification();

const step = ref(1); // 1: Year, 2: Make, 3: Model
const isLoading = ref(false);
const formRef = ref();

const formState = ref<Partial<FormStateType>>({});

const isNewMake = ref(false);
const isNewModel = ref(false);

const vehicleTypes = ref<string[]>([]);
const makes = ref<VehicleMake[]>([]);
const models = ref<Vehicle[]>([]);
const isMakesLoading = ref(false);
const isModelsLoading = ref(false);

const selectedMakeName = computed(() => {
  if (isNewMake.value) return formState.value.makeName;
  const make = makes.value.find((m: VehicleMake) => m.id === formState.value.makeYearId);
  return make ? make.name : formState.value.makeName;
});

onMounted(async () => {
  try {
    vehicleTypes.value = await DictionariesServiceInstance.getVehicleTypes();
  } catch (err) {
    console.error('Failed to fetch vehicle types:', err);
  }
});

const resetForm = () => {
  step.value = 1;
  isNewMake.value = false;
  isNewModel.value = false;
  formState.value = {};
};

const closeModal = () => {
  emit('update:open', false);
};

const fetchMakes = async () => {
  if (!formState.value.year) return;
  isMakesLoading.value = true;
  try {
    makes.value = await DictionariesServiceInstance.getVehicleMakes(formState.value.year);
  } catch (err) {
    console.error('Failed to fetch makes:', err);
  } finally {
    isMakesLoading.value = false;
  }
};

const fetchModels = async () => {
  if (!formState.value.makeYearId) return;
  isModelsLoading.value = true;
  try {
    models.value = await DictionariesServiceInstance.getVehicleModels(formState.value.makeYearId);
  } catch (err) {
    console.error('Failed to fetch models:', err);
  } finally {
    isModelsLoading.value = false;
  }
};

watch(() => props.open, async (newVal: boolean) => {
  if (newVal) {
    step.value = props.initialStep;
    formState.value = {
      year: props.initialYear,
      makeName: props.initialMakeName || '',
      makeYearId: props.initialMakeYearId,
      modelName: '',
      vehicleId: undefined,
      type: undefined,
    };
    isNewMake.value = false;
    isNewModel.value = false;

    if (step.value === 2 || props.initialMakeYearId) {
      await fetchMakes();
    }
    if (step.value === 3) {
      await fetchModels();
    }
  } else {
    resetForm();
  }
});

const handleYearSubmit = async () => {
  if (!formState.value.year) return;
  if (formState.value.year < 1900 || formState.value.year > 2030) {
    formRef.value.setFieldError('year', 'Year must be between 1900 and 2030');
    return;
  }

  isLoading.value = true;
  try {
    await DictionariesServiceInstance.validateYear(formState.value.year);
    formState.value.makeYearId = undefined;
    await fetchMakes();
    step.value = 2;
  } catch (err) {
    if (err) showFormError(formRef.value, err);
  } finally {
    isLoading.value = false;
  }
};

const handleMakeSubmit = async () => {
  if (!formState.value.year) return;

  if (isNewMake.value) {
    if (!formState.value.makeName) return;
    isLoading.value = true;
    try {
      const response = await DictionariesServiceInstance.createMakeYear({
        year: formState.value.year,
        make: formState.value.makeName,
      });
      formState.value.makeYearId = response.make_year.id;
      await fetchModels();
      step.value = 3;
    } catch (err) {
      if (err) showFormError(formRef.value, err);
    } finally {
      isLoading.value = false;
    }
  } else {
    if (!formState.value.makeYearId) return;
    isLoading.value = true;
    await fetchModels();
    isLoading.value = false;
    step.value = 3;
  }
};

const handleModelSubmit = async () => {
  if (!formState.value.makeYearId) return;

  if (isNewModel.value) {
    if (!formState.value.modelName || !formState.value.type) return;
    isLoading.value = true;
    try {
      const response = await DictionariesServiceInstance.createVehicleModel({
        vehicle_make_year_id: formState.value.makeYearId,
        original_model: formState.value.modelName,
        type: formState.value.type,
      });
      notification.success({
        message: 'Success',
        description: 'Vehicle successfully created',
      });
      if (formState.value.year) {
        emit('success', {
          year: formState.value.year,
          makeYearId: formState.value.makeYearId,
          makeName: selectedMakeName.value || '',
          vehicleId: response.id,
          modelName: response.originalModel,
          type: response.type,
        });
      }
      closeModal();
    } catch (err) {
      if (err) showFormError(formRef.value, err);
    } finally {
      isLoading.value = false;
    }
  } else {
    if (!formState.value.vehicleId) return;
    if (formState.value.year && formState.value.makeYearId) {
      const selectedModel = models.value.find((m: Vehicle) => m.id === formState.value.vehicleId);
      emit('success', {
        year: formState.value.year,
        makeYearId: formState.value.makeYearId,
        makeName: selectedMakeName.value || '',
        vehicleId: formState.value.vehicleId,
        modelName: selectedModel ? selectedModel.originalModel : '',
        type: selectedModel?.type || '' as VehicleType,
      });
    }
    closeModal();
  }
};

const next = () => {
  if (step.value === 1) handleYearSubmit();
  else if (step.value === 2) handleMakeSubmit();
  else if (step.value === 3) handleModelSubmit();
};

const typeOptions = computed(() => vehicleTypes.value.map((type) => ({
  value: type,
  label: type,
})));

const makeOptions = computed(() => makes.value.map((make: VehicleMake) => ({
  value: make.id,
  label: make.name,
})));

const modelOptions = computed(() => models.value.map((model: Vehicle) => ({
  value: model.id,
  label: model.originalModel,
})));
</script>

<template>
  <a-modal
    :footer="null"
    :open="open"
    title="Create New Vehicle"
    :mask-closable="false"
    destroy-on-close
    width="450px"
    @cancel="closeModal"
  >
    <Form
      ref="formRef"
      class="default-form"
      @submit="next"
    >
      <div v-if="step === 1">
        <BaseInput
          name="year"
          v-model="formState.year"
          label="Vehicle model year"
          type="number"
          rules="required"
          placeholder="Enter year (e.g. 2020)"
          autofocus
        />
      </div>

      <div v-else-if="step === 2">
        <div class="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-xl">
          <div class="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">Step 1: Year</div>
          <div class="text-2xl font-bold text-gray-900 leading-none">{{ formState.year }}</div>
        </div>

        <div v-if="!isNewMake">
          <BaseSelect
            name="makeYearId"
            v-model="formState.makeYearId"
            label="Select vehicle make"
            rules="required"
            placeholder="Select make"
            :options="makeOptions"
            :loading="isMakesLoading"
            show-search
          >
            <template #dropdownRender="{ menuNode: menu }">
              <component :is="menu" />
              <a-divider style="margin: 4px 0" />
              <div
                class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 text-primary-600 font-medium"
                @mousedown="e => e.preventDefault()"
                @click="isNewMake = true, formState.makeName = ''"
              >
                <PlusOutlined />
                Add new make
              </div>
            </template>
          </BaseSelect>
        </div>
        <div v-else>
          <div class="flex items-center justify-between mb-[6px]">
            <p class="block text-gray-700 font-medium text-sm">
              New vehicle make <span class="text-primary-600">*</span>
            </p>
            <a-button type="link" size="small" @click="isNewMake = false; formState.makeName = ''">
              Select existing
            </a-button>
          </div>
          <BaseInput
            name="makeName"
            v-model="formState.makeName"
            rules="required"
            placeholder="Enter make (e.g. BMW)"
            autofocus
          />
        </div>
      </div>

      <div v-else-if="step === 3">
        <div class="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-xl flex items-center gap-8">
          <div>
            <div class="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">Year</div>
            <div class="text-2xl font-bold text-gray-900 leading-none">{{ formState.year }}</div>
          </div>
          <div class="w-[1px] h-10 bg-primary-200" />
          <div>
            <div class="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">Make</div>
            <div class="text-2xl font-bold text-gray-900 leading-none">{{ selectedMakeName }}</div>
          </div>
        </div>

        <div v-if="!isNewModel">
          <BaseSelect
            name="vehicleId"
            v-model="formState.vehicleId"
            label="Select vehicle model"
            rules="required"
            placeholder="Select model"
            :options="modelOptions"
            :loading="isModelsLoading"
            show-search
            class="mb-4"
          >
            <template #dropdownRender="{ menuNode: menu }">
              <component :is="menu" />
              <a-divider style="margin: 4px 0" />
              <div
                class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 text-primary-600 font-medium"
                @mousedown="e => e.preventDefault()"
                @click="isNewModel = true"
              >
                <PlusOutlined />
                Add new model
              </div>
            </template>
          </BaseSelect>
        </div>
        <div v-else>
          <div class="flex items-center justify-between mb-[6px]">
            <p class="block text-gray-700 font-medium text-sm">
              New vehicle model <span class="text-primary-600">*</span>
            </p>
            <a-button type="link" size="small" @click="isNewModel = false; formState.modelName = ''; formState.type = undefined">
              Select existing
            </a-button>
          </div>
          <BaseInput
            name="modelName"
            v-model="formState.modelName"
            rules="required"
            placeholder="Enter model (e.g. X7)"
            class="mb-4"
            autofocus
          />
          <BaseSelect
            name="type"
            v-model="formState.type"
            label="Vehicle type"
            rules="required"
            placeholder="Select type"
            :options="typeOptions"
            show-search
          />
        </div>
      </div>

      <div class="flex items-center justify-end border-t border-gray-200 pt-4 mt-6">
        <a-button
          v-if="step > 1"
          class="mr-2"
          @click="step--"
        >
          Back
        </a-button>
        <a-button
          class="bg-gray-50"
          @click="closeModal"
        >
          Cancel
        </a-button>
        <a-button
          class="ml-2"
          html-type="submit"
          type="primary"
          :loading="isLoading"
        >
          {{ step === 3 ? 'Create' : 'Next' }}
        </a-button>
      </div>
    </Form>
  </a-modal>
</template>
