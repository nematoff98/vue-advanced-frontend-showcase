<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import {
  FullLeadInfo, LeadServiceInstance, LeadContactEditForm, CustomerIdType,
} from '@/services/lead';
import { useRoute } from 'vue-router';
import { Form } from 'vee-validate';
import BaseInput from '@/components/ui/BaseInput.vue';
import { notification } from 'ant-design-vue';
import { useErrorNotification } from '@/composables/useErrorNotification';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import { useCurrentUserStore } from '@/stores/useCurrentUser';

const currentUser = useCurrentUserStore();
const route = useRoute();
const { showFormError } = useErrorNotification();

interface ChatItemEditContactModalProps {
  open: boolean
  activeLead?: FullLeadInfo
}

interface ChatItemEditContactModalEmits {
  (e: 'update:open', value: boolean): void
  (e: 'update-lead'): void
}

const props = defineProps<ChatItemEditContactModalProps>();
const emits = defineEmits<ChatItemEditContactModalEmits>();

const form = ref<LeadContactEditForm>({});
const loading = ref(false);

const formRef = ref();

const customerIdTypeList = computed(() => [
  {
    label: 'Passport',
    value: CustomerIdType.PASSPORT,
  },
  {
    label: 'Driver license',
    value: CustomerIdType.DRIVER_LICENSE,
  },
  {
    label: 'National ID',
    value: CustomerIdType.NATIONAL_ID,
  },
]);

watch(() => props.open, (newValue) => {
  if (newValue) {
    if (!props?.activeLead) return;
    const leadInfo = props.activeLead;
    if (!leadInfo) return;
    form.value.firstName = leadInfo.firstName;
    form.value.lastName = leadInfo.lastName;
    form.value.email = leadInfo.email;
    form.value.bookingNumber = leadInfo.bookingNumber;
    form.value.customerIdNumber = leadInfo.customerIdNumber;
    form.value.customerIdType = leadInfo.customerIdType;
  } else {
    setTimeout(() => {
      form.value = {};
    }, 300);
  }
});

const saveLeadData = async () => {
  if (!route.query.leadId) return;
  loading.value = true;
  try {
    await LeadServiceInstance.updateLeadData(+route.query.leadId, {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      bookingNumber: form.value.bookingNumber,
      customerIdNumber: form.value.customerIdNumber,
      customerIdType: form.value.customerIdType,
    });
    emits('update:open', false);
    emits('update-lead');
    notification.success({
      message: 'Successfully',
      description: 'Lead information successfully changed',
    });
  } catch (err) {
    if (err) showFormError(formRef.value, err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <a-modal
    :footer="null"
    :open="open"
    centered
    :mask-closable="false"
    closable
    title="Edit Contact"
    :width="currentUser?.currentUser?.hasOrganizationOceanShipping ? '740px' : '400px'"
    @cancel="$emit('update:open', false)"
  >
    <Form
      ref="formRef"
      class="default-form"
      @submit="saveLeadData"
    >
      <a-row :gutter="[12, 12]">
        <a-col :span="currentUser?.currentUser?.hasOrganizationOceanShipping ? 12 : 24" :xs="24">
          <BaseInput
            v-model="form.firstName"
            label="First Name"
            name="first_name"
            placeholder="Enter First Name"
            rules="required"
          />
        </a-col>
        <a-col :span="currentUser?.currentUser?.hasOrganizationOceanShipping ? 12 : 24" :xs="24">
          <BaseInput
            v-model="form.lastName"
            label="Last Name"
            name="last_name"
            placeholder="Enter Last Name"
            rules="required"
          />
        </a-col>
        <a-col :span="currentUser?.currentUser?.hasOrganizationOceanShipping ? 12 : 24" :xs="24">
          <BaseInput
            v-model="form.email"
            label="Email"
            name="email"
            placeholder="Enter Email"
            rules="required|email"
          />
        </a-col>
        <a-col v-if="currentUser?.currentUser?.hasOrganizationOceanShipping" :span="12" :xs="24">
          <BaseSelect
            v-model="form.customerIdType"
            :options="customerIdTypeList"
            label="Customer ID type"
            name="customer_id_type"
            placeholder="Select Customer ID type"
            show-search
          />
        </a-col>
        <a-col v-if="currentUser?.currentUser?.hasOrganizationOceanShipping" :span="12" :xs="24">
          <BaseInput
            v-model="form.bookingNumber"
            label="Booking number"
            name="booking_number"
            placeholder="Enter Booking number"
          />
        </a-col>
        <a-col v-if="currentUser?.currentUser?.hasOrganizationOceanShipping" :span="12" :xs="24">
          <BaseInput
            v-model="form.customerIdNumber"
            label="Customer ID number"
            name="customer_id_number"
            placeholder="Enter Customer ID number"
          />
        </a-col>
      </a-row>
      <div class="flex items-center justify-end border-t border-gray-100 pt-3 mt-2">
        <a-button
          class="h-10 text-s"
          type="ghost"
          @click="$emit('update:open', false)"
        >Cancel
        </a-button>
        <a-button
          :loading="loading"
          class="h-10 rounded-xl text-s"
          html-type="submit"
          type="primary"
        >Save
        </a-button>
      </div>
    </Form>
  </a-modal>
</template>

<style lang="scss" scoped>

</style>
