<script setup lang="ts">
import BaseSelect from '@/components/ui/BaseSelect.vue';
import { onMounted, ref, watch } from 'vue';
import { SelectOption } from '@/services/general';
import { LeadProviderServiceInstance, Provider } from '@/services/lead-provider';

interface LeadProviderSelectorProps {
  modelValue?: number;
  name?: string;
  disabledIds?: number[];
}

interface LeadProviderSelectorEmits {
  (e: 'update:modelValue', value: number | undefined): void;
}

const props = withDefaults(defineProps<LeadProviderSelectorProps>(), {
  name: 'loadProvider',
});
const emit = defineEmits<LeadProviderSelectorEmits>();

const leadProvider = ref<number | undefined>(props.modelValue ?? undefined);
const isLoading = ref(false);
const leadProviderOptions = ref<SelectOption<number>[]>([]);
const providers = ref<Provider[]>([]);

const createOptions = () => {
  leadProviderOptions.value = providers.value.map((provider) => ({
    label: provider.name,
    value: provider.id,
    disabled: props.disabledIds?.includes(provider.id) ?? false,
  }));
};

const fetchLeadProviders = async () => {
  isLoading.value = true;

  try {
    providers.value = await LeadProviderServiceInstance.getProviders();
    createOptions();
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.modelValue, (newValue) => {
  leadProvider.value = newValue;
});

watch(leadProvider, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(() => props.disabledIds, () => {
  createOptions();
}, { deep: true });

onMounted(fetchLeadProviders);
</script>

<template>
  <BaseSelect
    name="loadProvider"
    rules="required"
    v-model="leadProvider"
    :loading="isLoading"
    :options="leadProviderOptions"
    label="Load provider"
    placeholder="Select load provider"
    show-search
  />
</template>

<style scoped lang="scss">

</style>
