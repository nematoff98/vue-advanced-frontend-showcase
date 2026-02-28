<script lang="ts" setup>
import ChatLeadAddressFormFillFavourites from '@/components/pages/chats/lead/ChatLeadAddressFormFillFavourites.vue';
import ChatLeadAddressFormModalItem from '@/components/pages/chats/lead/ChatLeadAddressFormModalItem.vue';
import { LeadAddressType } from '@/services/lead-address/lead-address.list';
import {
  Address, AddressForm, FavouritesAddresses, LeadAddress, LeadAddressServiceInstance,
} from '@/services/lead-address';
import {
  addError, addSuccess, DEFAULT_DATE_FORMAT, formattedDate,
} from '@/utils';
import { FullLeadInfo } from '@/services/lead';
import { useRoute } from 'vue-router';
import { Form } from 'vee-validate';
import { ref, watch } from 'vue';
import ChatLeadAddressAddToFavourite from '@/components/pages/chats/ChatLeadAddressAddToFavourite.vue';
import { PermissionEnum } from '@/utils/permission/enums';
import { useCan } from '@/utils/permission/can';

const route = useRoute();
const $can = useCan();

interface LeadsCreateModalProps {
  open: boolean
  lead?: FullLeadInfo
  location: Address
  address?: LeadAddress
  type: LeadAddressType
}

interface LeadsCreateModalEmits {
  (e: 'update:open', open: boolean): void

  (e: 'update-leads'): void

  (e: 'update-data'): void
}

const props = defineProps<LeadsCreateModalProps>();
const emits = defineEmits<LeadsCreateModalEmits>();

const activeTab = ref<LeadAddressType>(props.type || LeadAddressType.ORIGIN);
const resetForm = ref<boolean>(false);
const formData = ref<Record<LeadAddressType, AddressForm>>({
  origin: {
    helperAdditionalPhones: [{ value: '' }],
  },
  destination: {
    helperAdditionalPhones: [{ value: '' }],
  },
});
const isCreateLoading = ref<boolean>(false);
const isSearchLeadLoading = ref(false);
const addFavouriteModal = ref(false);
const favouritesModal = ref(false);
const isOriginPort = ref(false);
const isDestinationPort = ref(false);

const originFormRef = ref();
const destinationFormRef = ref();

const fillFormDataOpenModal = async () => {
  isOriginPort.value = !!props.address?.origin?.port?.id;
  isDestinationPort.value = !!props.address?.destination?.port?.id;
  if (props.address?.origin?.port?.id) {
    formData.value.origin.addressSearch = `${props.address.origin.port?.city} ${props.address.origin.port?.state} ${props.address.origin.port?.zip}`;
    formData.value.origin.state = props.address.origin.port?.state;
    formData.value.origin.zip = props.address.origin.port?.zip;
    formData.value.origin.city = props.address.origin.port?.city;
    formData.value.origin.country = props.address.origin.port?.country;
    formData.value.origin.address = props.address.origin.port?.address;
    formData.value.origin.portId = props.address.origin.port.id;
  } else {
    formData.value.origin.addressSearch = `${props.address?.origin?.city} ${props.address?.origin?.state} ${props.address?.origin?.zip}`;
    formData.value.origin.state = props.address?.origin?.state;
    formData.value.origin.zip = props.address?.origin?.zip;
    formData.value.origin.city = props.address?.origin?.city;
    formData.value.origin.country = props.address?.origin?.country;
    formData.value.origin.address = props.address?.origin?.address;
  }
  formData.value.origin.phone = props.address?.origin?.phone;
  formData.value.origin.isResidential = props.address?.origin?.isResidential;
  formData.value.origin.contactName = props.address?.origin?.contactName;
  formData.value.origin.comment = props.address?.origin?.comment;
  formData.value.origin.buyerNumber = props.address?.origin?.buyerNumber;
  if (props.address?.origin?.date) formData.value.origin.date = formattedDate(props.address?.origin?.date, DEFAULT_DATE_FORMAT);
  if (props.address?.origin?.additionalPhones?.length) {
    formData.value.origin.additionalPhones = props.address?.origin?.additionalPhones;
    formData.value.origin.helperAdditionalPhones = [];
    props.address.origin.additionalPhones.forEach((p) => {
      formData.value.origin.helperAdditionalPhones.push({ value: p });
    });
  }

  if (props.address?.destination?.port?.id) {
    formData.value.destination.addressSearch = `${props.address.destination.port?.city} ${props.address.destination.port?.state} ${props.address.destination.port?.zip}`;
    formData.value.destination.state = props.address?.destination?.port?.state;
    formData.value.destination.zip = props.address?.destination?.port?.zip;
    formData.value.destination.city = props.address?.destination?.port?.city;
    formData.value.destination.country = props.address?.destination?.port?.country;
    formData.value.destination.address = props.address?.destination?.port?.address;
    formData.value.destination.portId = props.address.destination.port.id;
  } else {
    formData.value.destination.addressSearch = `${props.address?.destination?.city} ${props.address?.destination?.state} ${props.address?.destination?.zip}`;
    formData.value.destination.state = props.address?.destination?.state;
    formData.value.destination.zip = props.address?.destination?.zip;
    formData.value.destination.city = props.address?.destination?.city;
    formData.value.destination.country = props.address?.destination?.country;
    formData.value.destination.address = props.address?.destination?.address;
  }
  formData.value.destination.phone = props.address?.destination?.phone;
  formData.value.destination.isResidential = props.address?.destination?.isResidential;
  formData.value.destination.contactName = props.address?.destination?.contactName;
  formData.value.destination.comment = props.address?.destination?.comment;
  formData.value.destination.buyerNumber = props.address?.destination?.buyerNumber;
  if (props.address?.destination?.date) formData.value.destination.date = formattedDate(props.address?.destination?.date, DEFAULT_DATE_FORMAT);
  if (props.address?.destination?.additionalPhones?.length) {
    formData.value.destination.additionalPhones = props.address?.destination?.additionalPhones;
    formData.value.destination.helperAdditionalPhones = [];
    props.address.destination.additionalPhones.forEach((p) => {
      formData.value.destination.helperAdditionalPhones.push({ value: p });
    });
  }
};

watch(() => isOriginPort.value, (newValue) => {
  if (!newValue) {
    formData.value.origin.portId = undefined;
  }
});

watch(() => isDestinationPort.value, (newValue) => {
  if (!newValue) {
    formData.value.destination.portId = undefined;
  }
});

watch(() => props.open, (newValue) => {
  if (!newValue) {
    activeTab.value = LeadAddressType.ORIGIN;
  } else {
    fillFormDataOpenModal();
  }
});

const isAllTabFormsValid = async () => {
  if (activeTab.value === LeadAddressType.ORIGIN) {
    const originFormValid = await originFormRef.value?.validate();
    if (!originFormValid?.valid) {
      activeTab.value = LeadAddressType.ORIGIN;
      return false;
    }
  } else if (activeTab.value === LeadAddressType.DESTINATION) {
    const destinationFormValid = await destinationFormRef.value?.validate();
    if (!destinationFormValid?.valid) {
      activeTab.value = LeadAddressType.DESTINATION;
      setTimeout(() => {
        destinationFormRef.value?.validate();
      }, 200);
      return false;
    }
  }

  return true;
};

const save = async () => {
  const { leadId } = route.query;
  if (!leadId) return;
  const isFormValid = await isAllTabFormsValid();
  if (!isFormValid) return;

  if (activeTab.value === LeadAddressType.ORIGIN) {
    if (formData.value.origin.helperAdditionalPhones?.length && formData.value.origin.helperAdditionalPhones[0].value) {
      formData.value.origin.additionalPhones = [];
      formData.value.origin.helperAdditionalPhones.forEach((value: { value: string }) => {
        formData.value.origin.additionalPhones?.push(value.value);
      });
    }
    formData.value.origin.type = activeTab.value;
    if (!formData.value.origin.isResidential) formData.value.origin.isResidential = false;
  }

  if (activeTab.value === LeadAddressType.DESTINATION) {
    if (formData.value.destination.helperAdditionalPhones?.length && formData.value.destination.helperAdditionalPhones[0].value) {
      formData.value.destination.additionalPhones = [];
      formData.value.destination.helperAdditionalPhones.forEach((value: { value: string }) => {
        formData.value.destination.additionalPhones?.push(value.value);
      });
    }
    formData.value.destination.type = activeTab.value;
    if (!formData.value.destination.isResidential) formData.value.destination.isResidential = false;
  }

  isCreateLoading.value = true;
  try {
    await LeadAddressServiceInstance.updateLeadAddresses(+leadId, formData.value[activeTab.value]);
    emits('update:open', false);
    addSuccess('Lead address successfully updated');
    emits('update-leads');
    emits('update-data');
  } catch (err) {
    addError('Something went wrong');
  } finally {
    isCreateLoading.value = false;
  }
};

const fillFromFavourites = (address: FavouritesAddresses) => {
  if (activeTab.value === LeadAddressType.ORIGIN) {
    formData.value.origin.address = address.address;
    formData.value.origin.city = address.city;
    formData.value.origin.state = address.state;
    formData.value.origin.zip = address.zip;
    formData.value.origin.country = address.country;
    formData.value.origin.isResidential = address.isResidential;
    formData.value.origin.phone = address.phone;
    formData.value.origin.contactName = address.contactName;
    formData.value.origin.comment = address.comment;
    formData.value.origin.buyerNumber = address.buyerNumber;
    formData.value.origin.additionalPhones = address.additionalPhones;
    formData.value.origin.portId = address.port?.id;
    if (address.additionalPhones?.length) {
      formData.value.origin.helperAdditionalPhones = [];
      address.additionalPhones.forEach((p) => {
        formData.value.origin.helperAdditionalPhones.push({ value: p });
      });
    }
    formData.value.origin.addressSearch = `${address.city} ${address.state} ${address.zip}`;
  }
  if (activeTab.value === LeadAddressType.DESTINATION) {
    formData.value.destination.address = address.address;
    formData.value.destination.city = address.city;
    formData.value.destination.state = address.state;
    formData.value.destination.zip = address.zip;
    formData.value.destination.country = address.country;
    formData.value.destination.isResidential = address.isResidential;
    formData.value.destination.phone = address.phone;
    formData.value.destination.contactName = address.contactName;
    formData.value.destination.comment = address.comment;
    formData.value.destination.buyerNumber = address.buyerNumber;
    formData.value.destination.additionalPhones = address.additionalPhones;
    formData.value.destination.portId = address.port?.id;
    if (address.additionalPhones?.length) {
      formData.value.destination.helperAdditionalPhones = [];
      address.additionalPhones.forEach((p) => {
        formData.value.destination.helperAdditionalPhones.push({ value: p });
      });
    }
    formData.value.destination.addressSearch = `${address.city} ${address.state} ${address.zip}`;
  }
};

const fillFormData = (value: boolean) => {
  if (value) {
    if (activeTab.value === LeadAddressType.ORIGIN) {
      formData.value.origin.phone = props.lead?.phone;
      formData.value.origin.contactName = props.lead?.fullName;
    } else {
      formData.value.destination.phone = props.lead?.phone;
      formData.value.destination.contactName = props.lead?.fullName;
    }
  } else if (activeTab.value === LeadAddressType.DESTINATION) {
    formData.value.origin.phone = '';
    formData.value.origin.contactName = '';
  } else {
    formData.value.destination.phone = '';
    formData.value.destination.contactName = '';
  }
};

const cancel = () => {
  emits('update:open', false);
};
</script>

<template>
  <a-modal
    :footer="false"
    :open="open"
    class="h-[750px]"
    title="Edit Address"
    width="700px"
    :mask-closable="false"
    closable
    @cancel="cancel"
  >
    <a-tabs
      v-model:activeKey="activeTab"
      class="tab-button">
      <a-tab-pane :key="LeadAddressType.ORIGIN" tab="Origin">
        <Form ref="originFormRef">
          <ChatLeadAddressFormModalItem
            v-model="formData.origin"
            v-model:reset-form="resetForm"
            v-model:is-port="isOriginPort"
            :is-search-loading="isSearchLeadLoading"
            :type="activeTab"
            @update:contact-lead-info="fillFormData"
          />
        </Form>
      </a-tab-pane>
      <a-tab-pane :key="LeadAddressType.DESTINATION" tab="Destination">
        <Form ref="destinationFormRef">
          <ChatLeadAddressFormModalItem
            v-model="formData.destination"
            v-model:reset-form="resetForm"
            v-model:is-port="isDestinationPort"
            :is-search-loading="isSearchLeadLoading"
            :type="activeTab"
            @update:contact-lead-info="fillFormData"
          />
        </Form>
      </a-tab-pane>
    </a-tabs>
    <div class="flex items-center justify-between pt-3 border-t border-gray-200 mt-3">
      <div class="flex items-center">
        <a-button
          class="border-none bg-green-50 text-green-600 h-10"
          @click="favouritesModal = true"
        >
          Fill from favorites
        </a-button>
        <a-button
          v-if="$can(PermissionEnum.ADD_FAVOURITE_ADDRESS)"
          class="border-none bg-primary-50 text-primary-600 h-10 ml-2"
          @click="addFavouriteModal = true"
        >
          Add address to favorites
        </a-button>
      </div>
      <div>
        <a-button
          class="border-none bg-gray-50 text-gray-700 h-10"
          @click="cancel"
        >
          Cancel
        </a-button>
        <a-button
          :loading="isCreateLoading"
          class="h-10"
          type="primary"
          @click="save"
        >
          Save
        </a-button>
      </div>
    </div>
    <ChatLeadAddressFormFillFavourites
      :open="favouritesModal"
      @fill="fillFromFavourites"
      @update:open="favouritesModal = $event"
    />
    <ChatLeadAddressAddToFavourite
      :open="addFavouriteModal"
      :address-form="formData[activeTab]"
      :type="activeTab"
      @update:open="addFavouriteModal = $event"
    />
  </a-modal>
</template>
