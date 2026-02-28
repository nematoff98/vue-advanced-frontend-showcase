<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import {
  ChargePaymentRequestForm, CreatePaymentLinkRequestForm, PaymentProvider, PaymentPurpose, PaymentServiceInstance,
} from '@/services/payments';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import { Form } from 'vee-validate';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';
import { addSuccess, formatAmount } from '@/utils';
import BaseFileUpload from '@/components/ui/BaseFileUpload.vue';

interface Props {
  open: boolean
  type: 'create-link' | 'charge'
  leadId?: number | null
  paymentId?: number
  provider?: PaymentProvider
}

interface Emits {
  (e: 'update-data'): void

  (e: 'handle-close'): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const purposeTypes = ref([
  { label: 'Driver', value: PaymentPurpose.DRIVER },
  { label: 'Company', value: PaymentPurpose.COMPANY },
]);

const formState = reactive<CreatePaymentLinkRequestForm>({
  purposeType: PaymentPurpose.COMPANY,
});
const isLoading = ref(false);
const amountWithFee = ref<string>();

const chargeFormRef = ref();

watch(() => props.open, (newValue) => {
  if (newValue) {
    formState.amount = undefined;
    formState.comment = undefined;
    formState.purposeType = undefined;
    formState.idempotencyKey = undefined;
  }
  if (chargeFormRef.value) chargeFormRef.value.resetForm();
});

const closeModal = () => emit('handle-close');

const createLink = async (params: CreatePaymentLinkRequestForm) => {
  if (!props.leadId) return;
  isLoading.value = true;
  try {
    const response = await PaymentServiceInstance.createLink(props.leadId, params);
    emit('handle-close');
    addSuccess('Link successfully created and copied to your clipboard!');
    await navigator.clipboard.writeText(response);
    emit('update-data');
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const toFormData = (form: ChargePaymentRequestForm): FormData => {
  const formData = new FormData();

  if (form.amount !== undefined) {
    formData.append('amount', form.amount.toString());
  }

  if (form.comment !== undefined && form.comment !== null) {
    formData.append('comment', form.comment);
  }

  if (form.purposeType !== undefined) {
    formData.append('purposeType', form.purposeType.toString());
  }

  if (form.idempotencyKey !== undefined) {
    formData.append('idempotencyKey', form.idempotencyKey);
  }

  if (form.file !== undefined && form.file !== null) {
    formData.append('file', form.file);
  }

  return formData;
};

const charge = async (params: ChargePaymentRequestForm) => {
  if (!props.paymentId) return;
  isLoading.value = true;
  try {
    await PaymentServiceInstance.charge(props.paymentId, toFormData(params));
    emit('update-data');
    emit('handle-close');
    addSuccess(`${formatAmount(params.amount)} charged successfully!`);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const onFinish = async () => {
  formState.idempotencyKey = uuidv4();
  if (props.type === 'create-link' && props.leadId) {
    await createLink(formState);
  } else if (props.paymentId) {
    await charge({
      comment: formState.comment,
      amount: formState.amount,
      purposeType: formState.purposeType,
      idempotencyKey: formState.idempotencyKey,
      file: formState.file,
    });
  }
};

const calculateFees = debounce(async () => {
  if (!formState.amount) return;
  try {
    amountWithFee.value = await PaymentServiceInstance.calculatePaymentFees(formState.amount);
  } catch (err) {
    console.error(err);
  }
}, 500);
</script>

<template>
  <a-modal
    :footer="null"
    :open="open"
    :title="type === 'charge' ? 'Charge payment' : 'Create link'"
    width="550px"
    :mask-closable="false"
    closable
    @cancel="closeModal"
  >
    <Form
      @submit="onFinish"
      ref="chargeFormRef"
    >
      <a-row class="mb-3" :gutter="[12, 12]">
        <a-col :span="24">
          <BaseInput
            name="amount"
            label="Amount"
            placeholder="Enter amount"
            rules="required"
            v-model="formState.amount"
            @update:model-value="calculateFees"
          />
        </a-col>
        <a-col :span="24">
          <div class="py-3 px-5 mb-0 bg-yellow-50 flex items-center gap-3 rounded-xl text-yellow-500">
            <Icon :icon="Icons.ALERT_CIRCLE" />
            <span class="text-sm">Will charge with fee: $<span>{{ amountWithFee ? formatAmount(+amountWithFee) : '0.00' }}</span>!</span>
          </div>
        </a-col>
        <a-col :span="24">
          <BaseInput
            name="comment"
            label="Comment form payment"
            placeholder="Enter comment"
            v-model="formState.comment"
          />
        </a-col>
        <a-col :span="24">
          <BaseSelect
            name="purposeType"
            :options="purposeTypes"
            rules="required"
            label="Purpose type"
            placeholder="Select purpose type"
            v-model="formState.purposeType"
          />
        </a-col>
        <a-col :span="24" v-if="provider === PaymentProvider.ZELLE">
          <BaseFileUpload
            name="image"
            v-model="formState.file"
          />
        </a-col>
      </a-row>

      <div class="flex items-center justify-end mt-4 border-t border-gray-200 pt-3 gap-2">
        <a-button class="bg-gray-50" html-type="button" type="ghost" @click="closeModal">Cancel</a-button>
        <a-button html-type="submit" type="primary" :loading="isLoading">
          {{ type === 'charge' ? 'Charge' : 'Create' }}
        </a-button>
      </div>
    </Form>
  </a-modal>
</template>
