<script lang="ts" setup>
import {
  Driver, DriverForm, DriverServiceInstance, LoadBoard, loadBoardTextMap,
} from '@/services/driver';
import { computed, ref, watch } from 'vue';
import { Form } from 'vee-validate';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BasePhoneInput from '@/components/ui/BasePhoneInput.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

interface Props {
  open: boolean
  driver?: Driver | null
}

interface Emits {
  (e: 'handle-close'): void
  (e: 'update-data'): void
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const title = computed(() => (props.driver ? 'Edit driver' : 'Create driver'));
const isLoading = ref(false);
const formState = ref<DriverForm>({});

const loadBoards = Object.entries(loadBoardTextMap).map(([key, label]) => ({
  value: key as LoadBoard,
  label,
}));

watch(() => props.open, (newValue) => {
  if (newValue && props.driver) {
    formState.value.phone = props.driver.phone;
    formState.value.loadBoard = props.driver.loadBoard;
    formState.value.companyName = props.driver.companyName;
    formState.value.fullName = props.driver.fullName;
  }
});

const closeModal = () => emit('handle-close');

const updateDriver = async () => {
  if (!props.driver?.id) return;
  isLoading.value = true;
  try {
    await DriverServiceInstance.updateDriver(props.driver.id, formState.value);
    emit('update-data');
    closeModal();
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const createDriver = async () => {
  const { chatId, leadId } = route.query;
  if (!chatId || !leadId) return;
  formState.value.chatId = +chatId;
  formState.value.leadId = +leadId;
  isLoading.value = true;
  try {
    await DriverServiceInstance.createDriver(formState.value);
    emit('update-data');
    closeModal();
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const onFinish = async () => {
  if (props.driver?.id) {
    await updateDriver();
  } else {
    await createDriver();
  }
};

</script>

<template>
  <a-modal
    :destroyOnClose="true"
    :footer="null"
    :open="open"
    :mask-closable="false"
    closable
    :title="title"
    width="550px"
    @cancel="closeModal"
  >
    <Form
      @submit="onFinish"
    >
      <a-row class="mb-3">
        <a-col :span="24">
          <BaseSelect
            name=""
            v-model="formState.loadBoard"
            :options="loadBoards"
            label="Load board"
            placeholder="Select load board"
          />
        </a-col>
      </a-row>

      <a-row class="mb-3">
        <a-col :span="24">
          <BaseInput
            name="fullName"
            v-model="formState.fullName"
            placeholder="Enter full name"
            label="Full name"
          />
        </a-col>
      </a-row>

      <a-row class="mb-3">
        <a-col :span="24">
          <base-phone-input
            v-model:value="formState.phone"
            name="phone"
            label="Phone"
            placeholder="Enter phone"
          />
        </a-col>
      </a-row>

      <a-row class="mb-3">
        <a-col :span="24">
          <BaseInput
            name="companyName"
            v-model="formState.companyName"
            placeholder="Enter company name"
            label="Company name"
          />
        </a-col>
      </a-row>

      <div class="flex items-center justify-end">
        <a-button
          class="bg-gray-50"
          type="ghost"
          @click="closeModal"
        >Cancel</a-button>
        <a-button
          html-type="submit"
          type="primary"
          :loading="isLoading"
        >Save</a-button>
      </div>
    </Form>
  </a-modal>
</template>

<style lang="scss" scoped>

</style>
