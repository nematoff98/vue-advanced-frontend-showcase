<script setup lang="ts">
import { ref, watch } from 'vue';
import { LeadVehicleServiceInstance } from '@/services/lead-vehicle';
import BaseEmpty from '@/components/ui/BaseEmpty.vue';

interface Props {
  vehicleId: number
}

const props = defineProps<Props>();

const open = defineModel('open', { type: Boolean });

const images = ref<string[]>([]);
const loading = ref<boolean>(false);

const getImages = async () => {
  loading.value = true;
  try {
    images.value = await LeadVehicleServiceInstance.getLeadVehicleImages(props.vehicleId);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

watch(() => open.value, (newValue) => {
  if (newValue) {
    getImages();
  } else {
    images.value = [];
  }
});
</script>

<template>
  <a-modal
    v-model:open="open"
    :footer="null"
    title="Vehicle Images"
    width="900px"
  >
    <a-spin :spinning="loading">
      <a-row
        v-if="images.length"
        :gutter="[16, 16]"
      >
        <a-col
          :span="6"
          v-for="(image, i) in images"
          :key="`image-${i}`"
        >
          <a-image
            :src="image"
            class="max-h-[250px]"
          />
        </a-col>
      </a-row>
      <BaseEmpty v-else />
    </a-spin>
  </a-modal>
</template>

<style scoped lang="scss">

</style>
