<script setup lang="ts">
import BaseInput from '@/components/ui/BaseInput.vue';
import { ref } from 'vue';
import { Form } from 'vee-validate';
import { AddressForm, LeadAddressServiceInstance } from '@/services/lead-address';
import { LeadAddressType } from '@/services/lead-address/lead-address.list';
import { addSuccess } from '@/utils';

interface ChatLeadAddressAddToFavouriteProps {
  open: boolean;
  addressForm: AddressForm
  type: LeadAddressType
}

interface ChatLeadAddressAddToFavouriteEmits {
  (e: 'update:open', value: boolean): void
}

const props = defineProps<ChatLeadAddressAddToFavouriteProps>();
const emits = defineEmits<ChatLeadAddressAddToFavouriteEmits>();

const name = ref('');
const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;
  const additionalPhones = [] as string[];
  if (props.addressForm.helperAdditionalPhones?.length && props.addressForm.helperAdditionalPhones[0].value) {
    props.addressForm.helperAdditionalPhones.forEach((value: {value: string}) => {
      additionalPhones.push(value.value);
    });
  }
  const resultForm = {
    ...props.addressForm,
    additionalPhones,
    type: props.type,
  } as AddressForm;
  try {
    await LeadAddressServiceInstance.addAddressToFavourites(resultForm, name.value);
    emits('update:open', false);
    addSuccess('Lead address successfully added to favourites');
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <a-modal
    :open="open"
    title="Add to favourite"
    :footer="false"
    centered
    @cancel="emits('update:open', false)"
  >
    <Form @submit="save">
      <BaseInput
        name="name"
        placeholder="Enter name"
        v-model:value="name"
      />
      <div class="mt-3 pt-3 border-t border-gray-200 flex justify-end">
        <a-button
          class="border-none bg-gray-50 text-gray-700 h-10 mr-2"
          @click="emits('update:open', false)"
        >
          Cancel
        </a-button>
        <a-button
          :loading="isLoading"
          class="h-10"
          type="primary"
          html-type="submit"
        >
          Save
        </a-button>
      </div>
    </Form>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
