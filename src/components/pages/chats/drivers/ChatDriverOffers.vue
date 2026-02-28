<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { LeadOffer, LeadOfferServiceInstance } from '@/services/lead-offer';
import BaseEmpty from '@/components/ui/BaseEmpty.vue';
import ChatDriverOfferItem from './ChatDriverOfferItem.vue';

const route = useRoute();
const isLoading = ref(false);
const offers = ref<LeadOffer[]>([]);

const leadId = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const fetchOffers = async (lId: number) => {
  isLoading.value = true;
  try {
    offers.value = await LeadOfferServiceInstance.getOffers(lId);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

watchEffect(() => {
  if (leadId.value) fetchOffers(leadId.value);
});
</script>

<template>
  <a-spin :spinning="isLoading">
    <div class="bg-white rounded-2xl p-3 min-h-[100px]">
      <article>
        <h2 class="text-gray-600 font-bold mb-2">Offers</h2>

        <ul v-if="offers?.length" class="flex flex-col gap-2">
          <li v-for="offer in offers" :key="offer.id">
            <ChatDriverOfferItem
              :offer="offer"
              @update-offers="fetchOffers(leadId!!)"
            />
          </li>
        </ul>

        <BaseEmpty
          v-else
          description="No offers found"
        />

      </article>
    </div>
  </a-spin>
</template>
