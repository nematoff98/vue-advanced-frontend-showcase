<script setup lang="ts">
import BaseRangeDatepicker from '@/components/ui/BaseRangeDatepicker.vue';
import BaseDatepicker from '@/components/ui/BaseDatepicker.vue';
import BaseTextarea from '@/components/ui/BaseTextarea.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import {
  LeadPost, LeadPostDateTypeEnum, leadPostDateTypeOptions, LeadPostForm, LeadPostListInstance,
} from '@/services/lead-post';
import { FullLeadInfo, LeadPaymentMethods, leadPaymentMethodsOptions } from '@/services/lead';
import { Form } from 'vee-validate';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { notification } from 'ant-design-vue';
import { LoadBoard } from '@/services/driver';
import { DEFAULT_DATE_FORMAT, formattedDate, isPastDate } from '@/utils';
import dayjs, { Dayjs } from 'dayjs';
import { useErrorNotification } from '@/composables/useErrorNotification';

const route = useRoute();
const useError = useErrorNotification();

interface Props {
  open: boolean
  lead?: FullLeadInfo
  leadPost?: LeadPost
  activeLoadBoard?: LoadBoard
}

interface Emits {
  (e: 'update:open', value: boolean): void

  (e: 'update:data'): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formState = ref<LeadPostForm>({});
const deliveryDate = ref<string[]>([]);
const pickupDate = ref<string[]>([]);
const deliveryCustomerDate = ref<string[]>([]);
const loading = ref(false);
const postId = ref<number>();

const formRef = ref();

const clearForm = () => {
  formState.value = {};
  deliveryDate.value = [];
  pickupDate.value = [];
  deliveryCustomerDate.value = [];
  postId.value = undefined;
};

const postToSD = async () => {
  if (
    isPastDate(formState.value.firstPickupDate)
    || isPastDate(deliveryDate.value[0])
    || isPastDate(pickupDate.value[0])
    || isPastDate(deliveryCustomerDate.value[0])
  ) return;
  const { leadId } = route.query;
  if (!leadId) return;
  loading.value = true;
  const [deliveryStartDate, deliveryEndDate] = deliveryDate.value;
  const [pickupStartDate, pickupEndDate] = pickupDate.value;
  const [customerStartDate, customerEndDate] = deliveryCustomerDate.value;

  formState.value.deliveryScheduleDate = deliveryStartDate;
  formState.value.deliveryScheduleEndDate = deliveryEndDate;
  formState.value.pickupScheduleDate = pickupStartDate;
  formState.value.pickupScheduleEndDate = pickupEndDate;
  formState.value.deliveryScheduleByCustomerDate = customerStartDate;
  formState.value.deliveryScheduleByCustomerEndDate = customerEndDate;
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

const fillFormState = () => {
  if (props.leadPost?.id) {
    postId.value = props.leadPost.id;
    formState.value.loadBoard = props.leadPost.loadBoard;
    // formState.value.postToCentralDispatch = props.leadPost.isPostedCd;
    formState.value.price = props.leadPost.price;
    formState.value.deposit = props.leadPost.deposit;
    formState.value.pickupDateType = props.leadPost.pickupDateType;
    formState.value.firstPickupDate = formattedDate(props.leadPost?.firstPickupDate, DEFAULT_DATE_FORMAT);
    formState.value.pickupScheduleEndDate = formattedDate(props.leadPost?.pickupScheduleEndDate, DEFAULT_DATE_FORMAT);
    formState.value.pickupScheduleDate = props.leadPost.pickupScheduleDate;
    formState.value.deliveryDateType = props.leadPost.deliveryDateType;
    formState.value.deliveryScheduleDate = props.leadPost.deliveryScheduleDate;
    formState.value.deliveryScheduleEndDate = props.leadPost.deliveryScheduleEndDate;
    formState.value.paymentMethod = props.leadPost.paymentMethod;
    formState.value.duePrice = props.leadPost.duePrice;
    formState.value.deliveryScheduleByCustomerEndDate = props.leadPost.deliveryScheduleByCustomerEndDate;
    formState.value.deliveryScheduleByCustomerDate = props.leadPost.deliveryScheduleByCustomerDate;
    formState.value.loadBoardInstructions = props.leadPost.loadBoardInstructions;
    formState.value.comment = props.leadPost.comment;

    deliveryDate.value = [
      formattedDate(props.leadPost.deliveryScheduleDate, DEFAULT_DATE_FORMAT),
      formattedDate(props.leadPost.deliveryScheduleEndDate, DEFAULT_DATE_FORMAT)];
    pickupDate.value = [
      formattedDate(props.leadPost.pickupScheduleDate, DEFAULT_DATE_FORMAT),
      formattedDate(props.leadPost.pickupScheduleEndDate, DEFAULT_DATE_FORMAT),
    ];
    deliveryCustomerDate.value = [
      formattedDate(props.leadPost.deliveryScheduleByCustomerDate, DEFAULT_DATE_FORMAT),
      formattedDate(props.leadPost.deliveryScheduleByCustomerEndDate, DEFAULT_DATE_FORMAT),
    ];
  } else if (props.lead) {
    formState.value.price = props.lead.carrierFee;
    formState.value.deposit = props.lead?.deposit;
    formState.value.loadBoard = props.activeLoadBoard;
    formState.value.paymentMethod = LeadPaymentMethods.CASH;
    formState.value.pickupDateType = LeadPostDateTypeEnum.ESTIMATED;
    formState.value.deliveryDateType = LeadPostDateTypeEnum.ESTIMATED;
  }

  setTimeout(() => {
    if (!formRef.value) return;
    if (isPastDate(formState.value.firstPickupDate)) {
      formRef.value.setErrors({
        firstPickupDate: 'Date cannot be in the past',
      });
    }
    if (isPastDate(deliveryDate.value[0])) {
      formRef.value.setErrors({
        deliveryDate: 'Date cannot be in the past',
      });
    }
    if (isPastDate(pickupDate.value[0])) {
      formRef.value.setErrors({
        pickupDate: 'Date cannot be in the past',
      });
    }
    if (isPastDate(deliveryCustomerDate.value[0])) {
      formRef.value.setErrors({
        deliveryCustomerDate: 'Date cannot be in the past',
      });
    }
  }, 400);
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
    title="Post to SD"
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
            v-model.number="formState.price"
            label="Price"
            rules="required|numeric"
            placeholder="Enter price"
          />
        </a-col>
        <a-col :span="12">
          <BaseInput
            suffix="$"
            name="deposit"
            v-model.number="formState.deposit"
            label="Deposit"
            rules="required|numeric"
            placeholder="Enter deposit"
          />
        </a-col>
        <a-col :span="12">
          <BaseSelect
            name="paymentMethod"
            rules="required"
            label="Payment method"
            v-model="formState.paymentMethod"
            placeholder="Select method"
            :options="leadPaymentMethodsOptions"
          />
        </a-col>
        <a-col :span="12">
          <BaseInput
            suffix="$"
            name="duePrice"
            placeholder="Enter due from Carrier"
            label="Due from Carrier"
            rules="numeric"
            v-model.number="formState.duePrice"
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
          <BaseSelect
            name="deliveryDateType"
            label="Delivery date type"
            rules="required"
            v-model="formState.deliveryDateType"
            placeholder="Select date type"
            :options="leadPostDateTypeOptions"
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
          <BaseRangeDatepicker
            rules="required"
            name="deliveryDate"
            value-format="YYYY-MM-DD"
            :placeholder="['From', 'To']"
            label="Carrier Delivery Date"
            :disabled-date="disabledDate"
            v-model="deliveryDate"
          />
        </a-col>
        <a-col :span="12">
          <BaseRangeDatepicker
            rules="required"
            name="pickupDate"
            :placeholder="['From', 'To']"
            value-format="YYYY-MM-DD"
            label="Carrier Pickup Date"
            :disabled-date="disabledDate"
            v-model="pickupDate"
          />
        </a-col>
        <a-col :span="12">
          <BaseRangeDatepicker
            name="deliveryCustomerDate"
            value-format="YYYY-MM-DD"
            :placeholder="['From', 'To']"
            label="Customer Delivery Date"
            :disabled-date="disabledDate"
            v-model="deliveryCustomerDate"
          />
        </a-col>
        <!--        <a-col v-if="formState.loadBoard === LoadBoard.SUPER_DISPATCH" :span="12">-->
        <!--          <div>-->
        <!--            <label for="postToCentralDispatch" class="block text-gray-700 font-medium text-sm mb-[6px]">-->
        <!--              Post to Central Dispatch-->
        <!--            </label>-->
        <!--            <a-checkbox-->
        <!--              id="postToCentralDispatch"-->
        <!--              class="h-11 border border-gray-200 rounded-xl w-full px-3"-->
        <!--              v-model:checked="formState.postToCentralDispatch"-->
        <!--            >-->
        <!--              <span-->
        <!--                class="text-sm h-10 flex items-center"-->
        <!--                :class="{ 'text-primary': formState.postToCentralDispatch }"-->
        <!--              >Automatically post to CD</span>-->
        <!--            </a-checkbox>-->
        <!--          </div>-->
        <!--        </a-col>-->
        <a-col :span="24">
          <BaseTextarea
            name="loadBoardInstructions"
            placeholder="Enter Loadboard instructions"
            label="Loadboard instructions"
            height="80"
            v-model="formState.loadBoardInstructions"
          />
        </a-col>
        <a-col :span="24">
          <BaseTextarea
            name="comment"
            placeholder="Enter comment"
            label="Comment"
            height="80"
            v-model="formState.comment"
          />
        </a-col>
      </a-row>
      <div class="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
        <a-button class="bg-gray-50" html-type="button" type="ghost" @click="emit('update:open', false)">Cancel</a-button>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ postId ? 'Update Post' : 'Post' }}
        </a-button>
      </div>
    </Form>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
