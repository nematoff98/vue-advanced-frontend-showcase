<script lang="ts" setup>
import BasePhoneInput from '@/components/ui/BasePhoneInput.vue';
import BaseDatepicker from '@/components/ui/BaseDatepicker.vue';
import BaseTextarea from '@/components/ui/BaseTextarea.vue';
// import VInputGoogle from '@/components/ui/GoogleInput.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import Icon from '@/components/icon/Icon.vue';
import { LeadProviderServiceInstance } from '@/services/lead-provider';
import { LeadRequestForm } from '@/services/lead/lead.interface';
import { SelectOption } from '@/services/general';
import { Icons } from '@/components/icon/helpers';
import {
  computed, onMounted, ref, watch,
} from 'vue';
import { useVModel } from '@vueuse/core';
import { AddressForm } from '@/services/lead-address';
import { LeadAddressType } from '@/services/lead-address/lead-address.list';
import BaseGoogleInput from '@/components/ui/BaseGoogleInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import { OrganizationPort, PortsServiceInstance } from '@/services/ports';
import { useCurrentUserStore } from '@/stores/useCurrentUser';

const user = useCurrentUserStore();

interface Props {
  modelValue: AddressForm
  isSearchLoading?: boolean
  resetForm?: boolean
  type: LeadAddressType
}

interface Emits {
  (e: 'update:modelValue', form: LeadRequestForm): void

  (e: 'search:lead', leadId: number): void

  (e: 'update:resetForm', reset: boolean): void

  (e: 'update:contactLeadInfo', val: boolean): void
}

interface Location {
  city: string;
  state: string;
  zip: string;
  address?: string;
}

const emits = defineEmits<Emits>();
const props = defineProps<Props>();
const isPort = defineModel('isPort', { type: Boolean });

const searchByLeadId = ref<number>();
const formState = useVModel(props, 'modelValue', emits);
const originAddressSearch = ref<string>();
const destinationAddressSearch = ref<string>();
const orgPorts = ref<OrganizationPort[]>([]);
const fetchPortsLoading = ref(false);

const leadProviderList = ref<SelectOption<number>[]>([]);

const portsList = computed(() => orgPorts.value.map((item) => ({
  label: item.name,
  value: item.id,
})));

const getLeadProviders = async () => {
  try {
    const providers = await LeadProviderServiceInstance.getProviders();
    leadProviderList.value = providers.map((provider) => ({
      value: provider.id,
      label: provider.name,
    }));
  } catch (err) {
    console.error(err);
  }
};

const setFormLocation = (location: Location) => {
  const {
    city, state, zip, address,
  } = location;
  formState.value.state = state;
  formState.value.zip = zip;
  formState.value.city = city;
  formState.value.address = address;
};

const clearForm = () => {
  formState.value = {
    helperAdditionalPhones: [{ value: '' }],
  };
  originAddressSearch.value = undefined;
  destinationAddressSearch.value = undefined;
  searchByLeadId.value = undefined;
  emits('update:resetForm', false);
};

const fetchOrgPorts = async () => {
  try {
    fetchPortsLoading.value = true;
    orgPorts.value = await PortsServiceInstance.getOrgPorts();
  } catch (err) {
    console.error(err);
  } finally {
    fetchPortsLoading.value = false;
  }
};

fetchOrgPorts();

const contactToLead = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emits('update:contactLeadInfo', target.checked);
};

const selectedPort = (portId: number | string) => {
  const port = orgPorts.value.find((p) => p.id === portId);
  if (port) {
    formState.value.state = port.state;
    formState.value.zip = port.zip;
    formState.value.city = port.city;
    formState.value.address = port.address;
    formState.value.country = port.country;
  }
};

watch(() => props.resetForm, (newVal) => {
  if (newVal) {
    clearForm();
  }
});

watch(isPort, (newVal) => {
  if (!newVal) {
    formState.value.portId = undefined;
    formState.value.state = undefined;
    formState.value.zip = undefined;
    formState.value.city = undefined;
    formState.value.address = undefined;
  }
});

onMounted(getLeadProviders);
</script>

<template>
  <div class="mt-3">
    <a-row :gutter="[8, 12]">
      <a-col
        v-if="!isPort"
        :span="24"
      >
        <BaseGoogleInput
          id="originMap"
          v-model:value="formState.addressSearch"
          label="Location (City or Zip)"
          name="start_location"
          placeholder="Enter city or Zip"
          rules="required"
          size="large"
          @get-address="(location: Location) => setFormLocation(location)"
        >
          <template v-if="user?.currentUser?.hasOrganizationOceanShipping" #label-prefix>
            <a-checkbox v-model:checked="isPort">From Ports</a-checkbox>
          </template>
        </BaseGoogleInput>
      </a-col>
      <a-col
        v-else
        :span="24"
      >
        <BaseSelect
          name="origin_port_id"
          label="Origin port"
          placeholder="Select port"
          rules="required"
          :options="portsList"
          v-model="formState.portId"
          class="w-full"
          @update:model-value="selectedPort"
        >
          <template v-if="user?.currentUser?.hasOrganizationOceanShipping" #label-prefix>
            <a-checkbox v-model:checked="isPort">From Ports</a-checkbox>
          </template>
        </BaseSelect>
      </a-col>
      <template v-if="!isPort">
        <a-col :span="9">
          <BaseInput
            v-model="formState.state"
            label="State"
            name="state"
            placeholder="Enter state"
            rules="required"
          />
        </a-col>
        <a-col :span="9">
          <BaseInput
            v-model="formState.city"
            label="City"
            name="city"
            placeholder="Enter city"
            rules="required"
          />
        </a-col>
        <a-col :span="6">
          <BaseInput
            v-model="formState.zip"
            label="Zip"
            name="zip"
            placeholder="Enter zip"
            rules="required"
          />
        </a-col>
      </template>
      <a-col :span="24">
        <BaseInput
          v-model="formState.address"
          :disabled="isPort"
          label="Address"
          name="address"
          placeholder="Enter address"
        />
      </a-col>
      <a-col :span="12">
        <p class="block text-gray-700 font-medium text-sm mb-[6px]">
          Residential or not
        </p>
        <label
          class="border border-gray-200 rounded-xl flex items-center h-11 px-4 cursor-pointer"
          for="isResidential"
        >
          <a-checkbox class="mr-2" id="isResidential" v-model:checked="formState.isResidential" />
          <span class="text-base text-gray-700 font-light">Is residential</span>
        </label>
      </a-col>
      <a-col :span="12">
        <BaseDatepicker
          v-model="formState.date"
          :label="type === LeadAddressType.ORIGIN ? 'Pickup date' : 'Drop off date'"
          name="date"
          value-format="YYYY-MM-DD"
          placeholder="Select date"
          rules="required"
        />
      </a-col>
      <a-col :span="12">
        <BaseInput
          v-model="formState.contactName"
          label="Contact name"
          name="contactName"
          placeholder="Enter contact name"
        />
      </a-col>
      <a-col :span="12">
        <div class="text-gray-700 font-medium text-sm mb-[6px] flex justify-between">
          <div>
            Phone<span class="text-primary-600">*</span>
          </div>
          <div>
            <a-checkbox @change="contactToLead">
              Fill from lead data
            </a-checkbox>
          </div>
        </div>
        <BasePhoneInput
          v-model:value="formState.phone"
          name="phone"
          placeholder="(___) ___-____"
          rules="required"
        />
      </a-col>
      <a-col :span="12">
        <BaseInput
          v-model:value="formState.buyerNumber"
          label="Buyer number"
          name="buyerNumber"
          placeholder="Enter buyer number"
        />
      </a-col>
      <a-col
        :span="12"
        class="flex items-center"
        v-for="(phone, index) in formState?.helperAdditionalPhones"
        :key="`additionalPhone-${index}`"
      >
        <div class="w-full mr-1">
          <BasePhoneInput
            v-model:value="phone.value"
            label="Additional phone"
            name="additionalPhones"
            placeholder="(___) ___-____"
          />
        </div>
        <a-button
          v-if="index === formState.helperAdditionalPhones.length - 1 && index > 0"
          class="h-11 mt-[24px] rounded-xl border-none bg-red-50 text-red-600 mr-1"
          @click="formState.helperAdditionalPhones.pop()"
        >
          <Icon :icon="Icons.MINUS" />
        </a-button>
        <a-button
          v-if="index === formState.helperAdditionalPhones.length - 1"
          class="h-11 mt-[24px] rounded-xl border-none bg-primary-50 text-primary-600"
          @click="formState.helperAdditionalPhones.push({ value: '' })"
        >
          <Icon :icon="Icons.PLUS" />
        </a-button>
      </a-col>
      <a-col :span="24">
        <BaseTextarea
          v-model="formState.comment"
          class="w-full"
          label="Comment"
          :height="80"
          name="comment"
          placeholder="Enter your comment"
          size="large"
        />
      </a-col>
    </a-row>
  </div>
</template>
