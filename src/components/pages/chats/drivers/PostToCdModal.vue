<script setup lang="ts">
import BaseDatepicker from '@/components/ui/BaseDatepicker.vue';
import BaseTextarea from '@/components/ui/BaseTextarea.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import {
  BalancePaymentBegins,
  BalancePaymentMethods, BalancePaymentTime,
  CodLocations,
  leadBalancePaymentBeginsOptions,
  leadBalancePaymentMethodsOptions,
  leadBalancePaymentTimeOptions,
  LeadPost,
  LeadPostForm,
  LeadPostListInstance,
  leadPostToCDCodLocationsOptions,
  LeadPostToCDPaymentMethods,
  leadPostTOCDPaymentMethodsOptions,
} from '@/services/lead-post';
import { FullLeadInfo } from '@/services/lead';
import { Form } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { notification } from 'ant-design-vue';
import { LoadBoard } from '@/services/driver';
import { DEFAULT_DATE_FORMAT, formattedDate, isPastDate } from '@/utils';
import { LeadAddress } from '@/services/lead-address';
import dayjs, { Dayjs } from 'dayjs';
import { useErrorNotification } from '@/composables/useErrorNotification';

const route = useRoute();
const useError = useErrorNotification();

interface Props {
  open: boolean
  lead?: FullLeadInfo
  leadPost?: LeadPost
  addresses?: LeadAddress
  activeLoadBoard?: LoadBoard
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'update:data'): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formState = ref<LeadPostForm>({});
const loading = ref(false);
const postId = ref<number>();
const isDifferentPriceCodPrice = ref(false);

const formRef = ref();

const selectedPaymentMethodLabel = computed(() => leadPostTOCDPaymentMethodsOptions.find((p) => p.value === formState.value.paymentMethod));
const selectedCodLocationLabel = computed(() => leadPostToCDCodLocationsOptions.find((p) => p.value === formState.value.codLocation));
const selectedBalancePaymentTimeLabel = computed(() => leadBalancePaymentTimeOptions.find((p) => p.value === formState.value.balancePaymentTime));
const selectedBalancePaymentMethodLabel = computed(() => leadBalancePaymentMethodsOptions.find((p) => p.value === formState.value.balancePaymentMethod));
const selectedBalancePaymentBeginsLabel = computed(() => leadBalancePaymentBeginsOptions.find((p) => p.value === formState.value.balancePaymentBegins));

const clearForm = () => {
  formState.value = {};
  postId.value = undefined;
};

const postToSD = async () => {
  const { leadId } = route.query;
  if (!leadId || isPastDate(formState.value.firstPickupDate)) return;
  loading.value = true;
  try {
    if (postId.value) {
      await LeadPostListInstance.repostLeadToCDOrSD(+leadId, formState.value);
    } else {
      await LeadPostListInstance.postLeadToCDOrSD(+leadId, formState.value);
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

const calcBalanceAmount = () => {
  const price = formState.value.price ?? 0;
  const codPrice = formState.value.codPrice ?? 0;
  formState.value.balanceAmount = Math.abs(price - codPrice);
  isDifferentPriceCodPrice.value = formState.value.codPrice !== formState.value.price;
  if (isDifferentPriceCodPrice.value) {
    if (props.leadPost?.id) {
      formState.value.balancePaymentBegins = props.leadPost.balancePaymentBegins;
      formState.value.balancePaymentMethod = props.leadPost.balancePaymentMethod;
      formState.value.balancePaymentTime = props.leadPost.balancePaymentTime;
    } else {
      formState.value.balancePaymentMethod = BalancePaymentMethods.CASH;
      formState.value.balancePaymentTime = BalancePaymentTime.TEN_BUSINESS_DAYS;
      formState.value.balancePaymentBegins = BalancePaymentBegins.SIGNED_BILL_OF_LANDING;
    }
  }
};

const fillFormState = () => {
  if (props.leadPost?.id) {
    postId.value = props.leadPost.id;
    formState.value.loadBoard = props.leadPost.loadBoard;
    formState.value.price = props.leadPost.price;
    formState.value.firstPickupDate = formattedDate(props.leadPost?.firstPickupDate, DEFAULT_DATE_FORMAT);
    // formState.value.deliveryScheduleDate = formattedDate(props.leadPost.deliveryScheduleDate, DEFAULT_DATE_FORMAT);
    // formState.value.deliveryScheduleEndDate = formattedDate(props.leadPost.deliveryScheduleEndDate, DEFAULT_DATE_FORMAT);
    formState.value.balanceAmount = props.leadPost.balanceAmount;
    formState.value.balancePaymentBegins = props.leadPost.balancePaymentBegins;
    formState.value.balancePaymentMethod = props.leadPost.balancePaymentMethod;
    formState.value.balancePaymentTime = props.leadPost.balancePaymentTime;
    formState.value.codLocation = props.leadPost.codLocation;
    formState.value.codPrice = props.leadPost.codPrice;
    formState.value.paymentMethod = props.leadPost.paymentMethod;
    formState.value.loadBoardInstructions = props.leadPost.loadBoardInstructions;
    formState.value.comment = props.leadPost.comment;
  } else if (props.lead) {
    formState.value.loadBoard = props.activeLoadBoard;
    formState.value.paymentMethod = LeadPostToCDPaymentMethods.CASH;
    formState.value.codLocation = CodLocations.DELIVERY;
    formState.value.balancePaymentMethod = BalancePaymentMethods.CASH;
    formState.value.balancePaymentTime = BalancePaymentTime.TEN_BUSINESS_DAYS;
    formState.value.balancePaymentBegins = BalancePaymentBegins.SIGNED_BILL_OF_LANDING;
    formState.value.price = props.lead?.carrierFee;
    formState.value.codPrice = props.lead?.carrierFee;
    formState.value.firstPickupDate = formattedDate(props.addresses?.origin?.date, DEFAULT_DATE_FORMAT);
    // formState.value.deliveryScheduleEndDate = formattedDate(props.addresses?.destination?.date, DEFAULT_DATE_FORMAT);
    // formState.value.deliveryScheduleDate = formattedDate(props.addresses?.destination?.date, DEFAULT_DATE_FORMAT);
  }

  setTimeout(() => {
    if (!formRef.value) return;
    if (isPastDate(formState.value.firstPickupDate)) {
      formRef.value.setErrors({
        firstPickupDate: 'Date cannot be in the past',
      });
    }
  }, 400);
  calcBalanceAmount();
};

const disabledDate = (current: Dayjs) => current.isBefore(dayjs(), 'day');

watch(() => props.open, (newValue) => {
  if (newValue && !props.leadPost?.id) formState.value.loadBoard = props.activeLoadBoard;
  if (newValue) {
    fillFormState();
  } else {
    clearForm();
  }
});
</script>

<template>
  <a-modal
    :open="open"
    width="700px"
    title="Post to CD"
    :footer="false"
    :mask-closable="false"
    closable
    @cancel="emit('update:open', false)"
  >
    <Form ref="formRef" @submit="postToSD">
      <a-row :gutter="[12, 12]">
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
            name="codPrice"
            v-model.number="formState.codPrice"
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
              name="balancePaymentBegins"
              label="Balance Payment begins"
              v-model="formState.balancePaymentBegins"
              placeholder="Select payment begins"
              :options="leadBalancePaymentBeginsOptions"
            />
          </a-col>
        </template>
        <a-col :span="12">
          <BaseSelect
            name="paymentMethod"
            rules="required"
            label="COD/COP Payment Method"
            v-model="formState.paymentMethod"
            placeholder="Select method"
            :options="leadPostTOCDPaymentMethodsOptions"
          />
        </a-col>
        <a-col :span="12">
          <BaseSelect
            name="codLocation"
            rules="required"
            label="COD/COP Location"
            v-model="formState.codLocation"
            placeholder="Select method"
            :options="leadPostToCDCodLocationsOptions"
          />
        </a-col>
        <a-col :span="12">
          <BaseDatepicker
            rules="required"
            name="firstPickupDate"
            label="1st Avail. Pickup Date"
            v-model="formState.firstPickupDate"
            :disabled-date="disabledDate"
            placeholder="Select date"
          />
        </a-col>
        <a-col :span="12">
          <BaseDatepicker
            name="deliveryScheduleDate"
            label="Delivery Schedule Date"
            :disabled-date="disabledDate"
            v-model="formState.deliveryScheduleDate"
            placeholder="Select date"
          />
        </a-col>
        <a-col :span="12">
          <BaseDatepicker
            name="deliveryScheduleEndDate"
            label="Delivery Schedule End Date"
            :disabled-date="disabledDate"
            v-model="formState.deliveryScheduleEndDate"
            placeholder="Select date"
          />
        </a-col>
        <a-col :span="24">
          <BaseTextarea
            name="loadBoardInstructions"
            tooltip="Visible to carrier inside the Super Loadboard"
            placeholder="Enter Loadboard instructions"
            label="Loadboard instructions"
            height="80"
            v-model="formState.loadBoardInstructions"
          />
        </a-col>
        <a-col :span="24">
          <BaseTextarea
            name="comment"
            tooltip="Visible to carrier before and after accepting the load offer"
            placeholder="Enter Instructions"
            label="Order Instructions"
            height="80"
            v-model="formState.comment"
          />
        </a-col>
      </a-row>
      <div class="mt-6">
        <div v-if="selectedPaymentMethodLabel?.label && selectedCodLocationLabel?.label " class="text-base text-gray-500">
          The carrier will receive <span class="text-gray-700 font-bold"> {{ formState.codPrice || 0 }}$ </span> via
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
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ leadPost?.id ? 'Update Post' : 'Post' }}
        </a-button>
      </div>
    </Form>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
