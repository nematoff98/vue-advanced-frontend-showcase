<script setup lang="ts">
import BaseInput from '@/components/ui/BaseInput.vue';
import { FavouritesAddresses, LeadAddressServiceInstance } from '@/services/lead-address';
import { ref, watch, h } from 'vue';
import { debounce } from 'lodash';
// import Icon from '@/components/icon/Icon.vue';
// import { Icons } from '@/components/icon/helpers';
import { addSuccess } from '@/utils';
import { DeleteOutlined } from '@ant-design/icons-vue';

interface ChatLeadAddressFormFillFavouritesProps {
  open: boolean;
}

interface ChatLeadAddressFormFillFavouritesEmits {
  (e: 'update:open', value: boolean): void
  (e: 'fill', address: FavouritesAddresses): void
}

const props = defineProps<ChatLeadAddressFormFillFavouritesProps>();
const emits = defineEmits<ChatLeadAddressFormFillFavouritesEmits>();

const addressList = ref<FavouritesAddresses[]>([]);
const search = ref('');
const loading = ref(false);

const getFavourites = async () => {
  loading.value = true;
  try {
    const { items } = await LeadAddressServiceInstance.getFavouritesAddresses(search.value);
    addressList.value = items.map((p) => ({
      ...p,
      loading: false,
    }));
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const startSearch = debounce(getFavourites, 400);

const fill = (item: FavouritesAddresses) => {
  emits('fill', item);
  emits('update:open', false);
};

watch(() => props.open, (newValue) => {
  if (newValue) {
    getFavourites();
  } else {
    addressList.value = [];
  }
});

const removeFavouriteAddress = async (id: number, index: number) => {
  addressList.value[index].loading = true;
  try {
    await LeadAddressServiceInstance.removeAddressFromFavourites(id);
    await getFavourites();
    addSuccess('Successfully removed');
  } catch (err) {
    console.error(err);
  } finally {
    if (addressList.value[index]) addressList.value[index].loading = false;
  }
};
</script>

<template>
  <a-modal
    :open="open"
    centered
    title="Favourites"
    :footer="false"
    @cancel="emits('update:open', false)"
  >
    <BaseInput
      name="search"
      v-model:value="search"
      @update:model-value="startSearch"
    />
    <a-spin :spinning="loading">
      <div v-if="addressList?.length" class="mt-3 min-h-[100px] max-h-[450px] overflow-y-auto">
        <div
          v-for="(item, index) in addressList"
          :key="`address-${index}`"
          class="flex items-center justify-between p-1 hover:bg-gray-50 rounded-s mb-1 cursor-pointer"
          @click="fill(item)"
        >
          <div class="w-1/2">
            <div class="font-bold text-gray-700 text-[15px] mb-[2px]">
              {{ item.name }}
            </div>
            <div class="flex items-center gap-1 text-gray-400 text-xs">
              {{ item.city }},
              {{ item.state }},
              {{ item.zip }}
            </div>
          </div>
          <div class="w-1/2">
            <div class="font-bold text-gray-700 text-base mb-[2px]">
              {{ item.contactName }}
            </div>
            <div class="flex items-center gap-1 text-gray-400 text-xs">
              {{ item.phone }}
            </div>
          </div>
          <div
            class="pr-2 cursor-pointer"
            @click.stop="removeFavouriteAddress(item.id, index)"
          >
            <a-button :icon="h(DeleteOutlined)" :loading="item.loading" />
          </div>
        </div>
      </div>
      <a-empty v-else class="mt-3" />
    </a-spin>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
