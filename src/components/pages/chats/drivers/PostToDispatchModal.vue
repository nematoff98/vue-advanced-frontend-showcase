<script setup lang="ts">
import BaseDatepicker from '@/components/ui/BaseDatepicker.vue';
import BaseTextarea from '@/components/ui/BaseTextarea.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import {
  BalancePaymentBegins,
  BalancePaymentMethods,
  BalancePaymentTime,
  leadBalancePaymentBeginsOptions,
  leadBalancePaymentMethodsOptions,
  leadBalancePaymentTimeOptions,
  LeadDispatchToCDPaymentMethods,
  leadDispatchTOCDPaymentMethodsOptions,
  LeadPost,
  LeadPostDateTypeEnum,
  leadPostDateTypeOptions,
  LeadPostStatus,
  leadPostToCDCodLocationsOptions,
  LeadPostToCDPaymentMethods,
  leadPostTOCDPaymentMethodsOptions,
} from '@/services/lead-post';
import { FullLeadInfo } from '@/services/lead';
import { Form } from 'vee-validate';
import {
  computed,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { notification } from 'ant-design-vue';
import { LoadBoard } from '@/services/driver';
import { DEFAULT_DATE_FORMAT, formattedDate, isPastDate } from '@/utils';
import { LeadAddress } from '@/services/lead-address';
import BaseAutoComplete from '@/components/ui/BaseAutoComplete.vue';
import {
  CheckBeforeDispatchData,
  CustomerList,
  DispatchData,
  DispatchServiceInstance,
  LeadDispatchForm,
} from '@/services/dispatch';
import { SelectOption } from '@/services/general';
import { useErrorNotification } from '@/composables/useErrorNotification';
import dayjs, { Dayjs } from 'dayjs';

const route = useRoute();
const useError = useErrorNotification();

interface Props {
  open: boolean
  lead?: FullLeadInfo
  leadPost?: LeadPost;
  leadDispatchData?: DispatchData
  addresses?: LeadAddress
  activeLoadBoard?: LoadBoard
}

interface Emits {
  (e: 'update:open', value: boolean): void

  (e: 'update:data'): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formState = ref<LeadDispatchForm>({});
const loading = ref(false);
const dispatchId = ref<number>();
const isDifferentPriceCodPrice = ref(false);
const carriersList = ref<Array<CustomerList>>([]);
const beforeDispatchData = ref<CheckBeforeDispatchData>({
  is_valid: false,
});

const formRef = ref();

const selectedPaymentMethodLabel = computed(() => leadPostTOCDPaymentMethodsOptions.find((p) => p.value === formState.value.codPaymentMethod));
const selectedCodLocationLabel = computed(() => leadPostToCDCodLocationsOptions.find((p) => p.value === formState.value.codPaymentLocation));
const selectedBalancePaymentTimeLabel = computed(() => leadBalancePaymentTimeOptions.find((p) => p.value === formState.value.balancePaymentTime));
const selectedBalancePaymentMethodLabel = computed(() => leadBalancePaymentMethodsOptions.find((p) => p.value === formState.value.balancePaymentMethod));
const selectedBalancePaymentBeginsLabel = computed(() => leadBalancePaymentBeginsOptions.find((p) => p.value === formState.value.balancePaymentTermsBeginOn));
const carrierOptions = computed(() => {
  const result = [] as Array<SelectOption<string>>;
  carriersList.value.forEach((item) => {
    result.push({
      value: item.customerId,
      label: item.customerName,
    });
  });
  return result;
});

const clearForm = () => {
  formState.value = {};
  dispatchId.value = undefined;
};

const dispatchToCD = async () => {
  const { leadId } = route.query;
  if (!leadId || isPastDate(formState.value.pickupDate) || isPastDate(formState.value.deliveryDate)) return;
  loading.value = true;
  try {
    // formState.value.carrierId = 'f2719f35-7c70-4853-a0df-193341be1699';
    if (dispatchId.value && props.leadDispatchData?.status === LeadPostStatus.POSTED) {
      await DispatchServiceInstance.updateRepostLeadToCDOrSD(+dispatchId.value, formState.value);
    } else if (props.leadPost?.id) {
      await DispatchServiceInstance.dispatchToCD(props.leadPost.id, formState.value);
    }
    emit('update:open', false);
    emit('update:data');
    notification.success({
      message: 'Successfully',
      description: 'Lead successfully posted',
    });
  } catch (err) {
    useError.showFormError(formRef.value, err);
  } finally {
    loading.value = false;
  }
};

const selectedCarrier = (carrierId: string) => {
  formState.value.carrierId = carrierId;
};

const getCustomers = async (value: string) => {
  if (!value || value.length < 3) return;
  try {
    carriersList.value = await DispatchServiceInstance.getCustomerListData(value);
  } catch (err) {
    console.error(err);
  }
};

const checkBeforeDispatch = async () => {
  if (!props.leadPost?.id) return;
  try {
    beforeDispatchData.value = await DispatchServiceInstance.checkBeforeDispatch(props.leadPost.id);
  } catch (err) {
    console.error(err);
  }
};

const disabledDate = (current: Dayjs) => current.isBefore(dayjs(), 'day');

const calcBalanceAmount = () => {
  const price = formState.value.price ?? 0;
  const codPrice = formState.value.codAmount ?? 0;
  formState.value.balanceAmount = Math.abs(price - codPrice);
  isDifferentPriceCodPrice.value = formState.value.codAmount !== formState.value.price;
  if (isDifferentPriceCodPrice.value) {
    if (props.leadDispatchData?.id) {
      formState.value.balancePaymentTermsBeginOn = props.leadDispatchData.balancePaymentBeginsOn;
      formState.value.balancePaymentMethod = props.leadDispatchData.balancePaymentMethod;
      formState.value.balancePaymentTime = props.leadDispatchData.balancePaymentTime;
    } else {
      formState.value.balancePaymentMethod = BalancePaymentMethods.CASH;
      formState.value.balancePaymentTime = BalancePaymentTime.TEN_BUSINESS_DAYS;
      formState.value.balancePaymentTermsBeginOn = BalancePaymentBegins.SIGNED_BILL_OF_LANDING;
    }
  }
};

const fillFormState = () => {
  if (props.leadDispatchData?.id) {
    dispatchId.value = props.leadDispatchData.id;
    formState.value.loadBoard = props.leadDispatchData.loadBoard;
    formState.value.price = props.leadDispatchData.price;
    formState.value.pickupDate = formattedDate(props.leadDispatchData?.pickupDate, DEFAULT_DATE_FORMAT);
    formState.value.pickupDateType = props.leadDispatchData.pickupDateType || LeadPostDateTypeEnum.ESTIMATED;
    formState.value.deliveryDate = formattedDate(props.leadDispatchData.deliveryDate, DEFAULT_DATE_FORMAT);
    formState.value.deliveryDateType = props.leadDispatchData.deliveryDateType || LeadPostDateTypeEnum.ESTIMATED;
    formState.value.balanceAmount = props.leadDispatchData.balanceAmount;
    formState.value.balancePaymentTermsBeginOn = props.leadDispatchData.balancePaymentBeginsOn;
    formState.value.balancePaymentMethod = props.leadDispatchData.balancePaymentMethod;
    formState.value.balancePaymentTime = props.leadDispatchData.balancePaymentTime;
    formState.value.codPaymentLocation = props.leadDispatchData.codPaymentLocation;
    formState.value.codAmount = props.leadDispatchData.codAmount;
    formState.value.codPaymentMethod = props.leadDispatchData.codPaymentMethod === LeadPostToCDPaymentMethods.CASH ? LeadDispatchToCDPaymentMethods.CASH : LeadDispatchToCDPaymentMethods.CHECK;
    formState.value.instructions = props.leadDispatchData.instructions;
    formState.value.preDispatchNotes = props.leadDispatchData.preDispatchNotes;
  } else if (props.leadPost) {
    formState.value.loadBoard = props.leadPost.loadBoard;
    formState.value.price = props.leadPost.price;
    formState.value.pickupDate = formattedDate(props.leadPost?.firstPickupDate, DEFAULT_DATE_FORMAT);
    formState.value.pickupDateType = props.leadPost.pickupDateType || LeadPostDateTypeEnum.ESTIMATED;
    formState.value.deliveryDate = formattedDate(props.leadPost.deliveryScheduleDate, DEFAULT_DATE_FORMAT);
    formState.value.deliveryDateType = props.leadPost.deliveryDateType || LeadPostDateTypeEnum.ESTIMATED;
    formState.value.balanceAmount = props.leadPost.balanceAmount;
    formState.value.balancePaymentTermsBeginOn = props.leadPost.balancePaymentBegins;
    formState.value.balancePaymentMethod = props.leadPost.balancePaymentMethod;
    formState.value.balancePaymentTime = props.leadPost.balancePaymentTime;
    formState.value.codPaymentLocation = props.leadPost.codLocation;
    formState.value.codAmount = props.leadPost.codPrice;
    formState.value.codPaymentMethod = props.leadPost?.paymentMethod === LeadPostToCDPaymentMethods.CASH ? LeadDispatchToCDPaymentMethods.CASH : LeadDispatchToCDPaymentMethods.CHECK;
    formState.value.instructions = props.leadPost.loadBoardInstructions;
  }

  setTimeout(() => {
    if (!formRef.value) return;
    if (isPastDate(formState.value.pickupDate)) {
      formRef.value.setErrors({
        pickupDate: 'Date cannot be in the past',
      });
    }
    if (isPastDate(formState.value.deliveryDate)) {
      formRef.value.setErrors({
        deliveryDate: 'Date cannot be in the past',
      });
    }
  }, 400);
  calcBalanceAmount();
};

watch(() => props.open, (newValue) => {
  if (newValue && !props.leadDispatchData?.id) formState.value.loadBoard = props.activeLoadBoard;
  if (newValue) {
    fillFormState();
    checkBeforeDispatch();
  } else {
    clearForm();
  }
});
</script>

<template>
  <a-modal
    :open="open"
    width="700px"
    title="Dispatch"
    :footer="false"
    :mask-closable="false"
    closable
    @cancel="emit('update:open', false)"
  >
    <Form ref="formRef" @submit="dispatchToCD">
      <a-row :gutter="[12, 12]">
        <a-col v-if="!beforeDispatchData.is_valid && beforeDispatchData?.validation_errors" :span="24">
          <!--          <h3 class="text-m mb-2">Please make sure that the following fields are properly filled out before dispatching:</h3>-->
          <!--          <a-space direction="vertical" style="width: 100%">-->
          <!--            <a-alert-->
          <!--              v-for="(item, i) in beforeDispatchData.validation_errors"-->
          <!--              :key="`error-${i}`"-->
          <!--              :message="item"-->
          <!--              type="warning"-->
          <!--            />-->
          <!--          </a-space>-->

          <a-alert
            message="Please make sure that the following fields are properly filled out before dispatching:"
            type="warning"
            show-icon
          >
            <template #description>
              <ul class="ml-3">
                <li
                  v-for="(item, i) in beforeDispatchData.validation_errors"
                  :key="`error-${i}`"
                  class="list-disc mb-1"
                >
                  {{ item }}
                </li>
              </ul>
            </template>
          </a-alert>
        </a-col>
        <a-col :span="24">
          <BaseAutoComplete
            name="carrier_id"
            label="Carrier"
            v-model="formState.carrierId"
            show-search
            placeholder="Search carrier"
            :options="carrierOptions"
            @select="selectedCarrier"
            @search="getCustomers"
          />
        </a-col>
        <a-col :span="12">
          <BaseInput
            suffix="$"
            name="price"
            type="number"
            v-model.number="formState.price"
            label="Carrier Pay"
            rules="required|numeric"
            placeholder="Enter price"
            @update:model-value="calcBalanceAmount"
          />
        </a-col>
        <a-col :span="12">
          <BaseInput
            suffix="$"
            name="codAmount"
            v-model.number="formState.codAmount"
            label="COD/COP Amount"
            type="number"
            rules="required|numeric"
            placeholder="Enter Cod Price"
            @update:model-value="calcBalanceAmount"
          />
        </a-col>
        <a-col :span="12">
          <BaseInput
            suffix="$"
            name="balance_amount"
            type="number"
            v-model.number="formState.balanceAmount"
            label="Balance Amount"
            disabled
            rules="numeric"
            placeholder=""
          />
        </a-col>
        <template v-if="isDifferentPriceCodPrice">
          <a-col :span="12">
            <BaseSelect
              name="balancePaymentMethod"
              label="Balance Payment method"
              v-model="formState.balancePaymentMethod"
              placeholder="Select payment method"
              :options="leadBalancePaymentMethodsOptions"
            />
          </a-col>
          <a-col :span="12">
            <BaseSelect
              name="balancePaymentTime"
              label="Balance Payment time"
              v-model="formState.balancePaymentTime"
              placeholder="Select payment time"
              :options="leadBalancePaymentTimeOptions"
            />
          </a-col>
          <a-col :span="12">
            <BaseSelect
              name="balancePaymentTermsBeginsOn"
              label="Balance Payment begins"
              v-model="formState.balancePaymentTermsBeginOn"
              placeholder="Select payment begins"
              :options="leadBalancePaymentBeginsOptions"
            />
          </a-col>
        </template>
        <a-col :span="12">
          <BaseSelect
            name="codPaymentMethod"
            rules="required"
            label="COD/COP Payment Method"
            v-model="formState.codPaymentMethod"
            placeholder="Select method"
            :options="leadDispatchTOCDPaymentMethodsOptions"
          />
        </a-col>
        <a-col :span="12">
          <BaseSelect
            name="codPaymentLocation"
            rules="required"
            label="COD/COP Location"
            v-model="formState.codPaymentLocation"
            placeholder="Select Cod/COP Location"
            :options="leadPostToCDCodLocationsOptions"
          />
        </a-col>
        <a-col :span="12">
          <BaseDatepicker
            rules="required"
            name="pickupDate"
            :disabled-date="disabledDate"
            label="1st Avail. Pickup Date"
            v-model="formState.pickupDate"
            placeholder="Select date"
          />
        </a-col>
        <a-col :span="12">
          <BaseSelect
            name="pickupDateType"
            label="Pickup date type"
            rules="required"
            v-model="formState.pickupDateType"
            placeholder="Select date type"
            :options="leadPostDateTypeOptions"
          />
        </a-col>
        <a-col :span="12">
          <BaseDatepicker
            name="deliveryDate"
            label="Delivery Schedule Date"
            :disabled-date="disabledDate"
            v-model="formState.deliveryDate"
            placeholder="Select date"
          />
        </a-col>
        <a-col :span="12">
          <BaseSelect
            name="deliveryDateType"
            label="Delivery date type"
            rules="required"
            v-model="formState.deliveryDateType"
            placeholder="Select date type"
            :options="leadPostDateTypeOptions"
          />
        </a-col>
        <a-col :span="24">
          <BaseTextarea
            name="comment"
            placeholder="Enter comment"
            label="Comment"
            height="80"
            v-model="formState.instructions"
          />
        </a-col>
        <a-col :span="24">
          <BaseTextarea
            name="preDispatchNotes"
            placeholder="Enter Notes"
            label="Pre Dispatch Notes"
            height="80"
            v-model="formState.preDispatchNotes"
          />
        </a-col>
      </a-row>
      <div class="mt-6">
        <div v-if="selectedPaymentMethodLabel?.label && selectedCodLocationLabel?.label " class="text-base text-gray-500">
          The carrier will receive <span class="text-gray-700 font-bold"> {{ formState.codAmount || 0 }}$ </span> via
          <span v-if="selectedPaymentMethodLabel?.label" class="text-gray-700 font-bold">
            {{ selectedPaymentMethodLabel.label }}
          </span>
          at
          <span
            v-if="selectedCodLocationLabel?.label"
            class="text-gray-700 font-bold"
          >{{ selectedCodLocationLabel.label }}</span>
        </div>
        <div
          v-if="isDifferentPriceCodPrice"
          class="text-base text-gray-500 mt-3"
        >
          You will pay the carrier <span class="text-gray-700 font-bold"> {{ formState.balanceAmount || 0 }}$ </span> via
          <span
            v-if="selectedBalancePaymentMethodLabel?.label"
            class="text-gray-700 font-bold"
          >{{ selectedBalancePaymentMethodLabel.label }}</span>
          <span
            v-if="selectedBalancePaymentTimeLabel?.label"
            class="text-gray-700 font-bold">
            {{ selectedBalancePaymentTimeLabel.label }}
          </span>
          of
          <span
            v-if="selectedBalancePaymentBeginsLabel?.label"
            class="text-gray-700 font-bold"
          >{{ selectedBalancePaymentBeginsLabel.label }}</span>
        </div>
      </div>
      <div class="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
        <a-button class="bg-gray-50" html-type="button" type="ghost" @click="emit('update:open', false)">Cancel</a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          :disabled="!beforeDispatchData.is_valid"
        >
          {{ leadDispatchData?.status === LeadPostStatus.POSTED ? 'Update Dispatch' : 'Dispatch' }}
        </a-button>
      </div>
    </Form>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
