<template>
  <Field
    v-slot="{ errorMessage }"
    :label="label"
    :model-value="value"
    :name="name"
    :rules="rules"
  >
    <div class="flex items-center justify-between">
      <label :for="uniqueId" class="block text-gray-700 font-medium text-sm mb-[6px]">
        {{ label }} <span v-if="rules === 'required'" class="text-primary-600">*</span>
      </label>
      <slot name="label-prefix" />
    </div>
    <a-input
      :id="uniqueId"
      type="text"
      :class="errorMessage ? 'ant-input-status-error' : ''"
      :value="value"
      :placeholder="placeholder"
      v-bind="$attrs"
      @input="handleAddressInputChange"
    />
    <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
      {{ errorMessage }}
    </span>
    <div
      v-if="openList && list.length"
      class="absolute z-50 w-full mt-2 max-h-[300px] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg"
      v-click-outside="closeCallsDropdown"
    >
      <ul
        id="results"
      >
        <li
          v-for="item in list"
          :key="item.text"
          class="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
          @click="onPlaceSelected(item.value)"
        >
          {{ item.text }}
        </li>
      </ul>
    </div>
  </Field>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { Field } from 'vee-validate';

interface GetAddressType {
  city: string;
  state: string;
  zip: string;
  address?: string;
}

interface Props {
  label: string;
  name: string;
  rules?: string;
  errorMessage?: string;
  placeholder?: string;
}

interface Emits {
  (e: 'get-address', event: GetAddressType): void
}

const emits = defineEmits<Emits>();
defineProps<Props>();

const value = defineModel('value', { type: String });

const resultsContainerElement = ref<HTMLElement | null>(null);

const newestRequestId = ref(0);
const openList = ref(false);
const list = ref<Array<{ text: string, value: google.maps.places.PlacePrediction | null }>>([]);

const request = ref<google.maps.places.AutocompleteRequest>({
  input: '',
  language: 'en-US',
  region: 'us',
  locationRestriction: {
    north: 71.5388,
    south: 18.7763,
    west: -179.1489,
    east: -66.8854,
  },
});

const uniqueId = `google-input-${uuidv4()}`;

const closeCallsDropdown = () => {
  openList.value = false;
};

function refreshToken() {
  request.value.sessionToken = new google.maps.places.AutocompleteSessionToken();
}

async function onPlaceSelected(event: google.maps.places.PlacePrediction | null) {
  if (!event) {
    console.info('no place selected (onPlaceSelected)');
    return;
  }
  openList.value = false;
  const place = event.toPlace();
  await place.fetchFields({
    fields: ['addressComponents', 'formattedAddress', 'location'],
  });

  const baseComponents = place.addressComponents || [];

  type AddressComponentLike = google.maps.GeocoderAddressComponent | google.maps.places.AddressComponent;

  const getComponent = (components: AddressComponentLike[], type: string) => (
    components.find((comp) => comp.types.includes(type))
  );

  const getLongText = (component?: AddressComponentLike) => {
    if (!component) return '';
    return 'longText' in component ? component.longText : component.long_name;
  };

  const getShortText = (component?: AddressComponentLike) => {
    if (!component) return '';
    return 'shortText' in component ? component.shortText : component.short_name;
  };

  const getCityFromComponents = (components: AddressComponentLike[]) => (
    getLongText(getComponent(components, 'locality'))
    || getLongText(getComponent(components, 'administrative_area_level_2'))
    || getLongText(getComponent(components, 'postal_town'))
    || getLongText(getComponent(components, 'sublocality'))
    || ''
  );

  const getStateFromComponents = (components: AddressComponentLike[]) => (
    getShortText(getComponent(components, 'administrative_area_level_1')) || ''
  );

  const getZipFromComponents = (components: AddressComponentLike[]) => (
    getLongText(getComponent(components, 'postal_code'))
    || getLongText(getComponent(components, 'postal_code_prefix'))
    || ''
  );

  let city = getCityFromComponents(baseComponents);
  let state = getStateFromComponents(baseComponents);
  let zip = getZipFromComponents(baseComponents);

  const geocoder = new google.maps.Geocoder();
  const geocodeAsync = (requestData: google.maps.GeocoderRequest) => (
    new Promise<google.maps.GeocoderResult[]>((resolve) => {
      geocoder.geocode(requestData, (results, status) => {
        if (status === 'OK' && results && results.length) {
          resolve(results);
          return;
        }
        resolve([]);
      });
    })
  );

  const getCityFromResults = (results: google.maps.GeocoderResult[]) => (
    results
      .map((result) => getCityFromComponents(result.address_components || []))
      .find((candidate) => Boolean(candidate)) || ''
  );

  const getStateFromResults = (results: google.maps.GeocoderResult[]) => (
    results
      .map((result) => getStateFromComponents(result.address_components || []))
      .find((candidate) => Boolean(candidate)) || ''
  );

  const getZipFromResults = (results: google.maps.GeocoderResult[]) => (
    results
      .map((result) => getZipFromComponents(result.address_components || []))
      .find((candidate) => Boolean(candidate)) || ''
  );

  const enrichFromGeocodeResults = (results: google.maps.GeocoderResult[]) => {
    if (!results.length) return;
    if (!city) city = getCityFromResults(results);
    if (!state) state = getStateFromResults(results);
    if (!zip) zip = getZipFromResults(results);
  };

  const placeId = (place as { placeId?: string; id?: string; place_id?: string }).placeId
    || (place as { placeId?: string; id?: string; place_id?: string }).id
    || (place as { placeId?: string; id?: string; place_id?: string }).place_id;

  if ((!zip || !city) && placeId) {
    const results = await geocodeAsync({ placeId });
    enrichFromGeocodeResults(results);
  }

  if ((!zip || !city) && place.location) {
    const results = await geocodeAsync({ location: place.location });
    enrichFromGeocodeResults(results);
  }

  if ((!zip || !city) && place.formattedAddress) {
    const results = await geocodeAsync({ address: place.formattedAddress });
    enrichFromGeocodeResults(results);
  }

  value.value = `${city} ${state} ${zip}`.trim();
  emits('get-address', {
    city, state, zip, address: place.formattedAddress || undefined,
  });
  refreshToken();
}

async function makeAutocompleteRequest(inputEvent: Event) {
  openList.value = true;
  const target = inputEvent.target as HTMLInputElement;
  value.value = target.value;
  if (!target.value.trim()) {
    resultsContainerElement.value?.replaceChildren();
    return;
  }

  request.value.input = target.value;
  newestRequestId.value += 1;
  const requestId = newestRequestId.value;

  const autocompleteSuggestions = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
    request.value,
  );

  if (requestId !== newestRequestId.value) return;

  resultsContainerElement.value?.replaceChildren();

  list.value = [];

  autocompleteSuggestions.suggestions.forEach((suggestion) => {
    const { placePrediction } = suggestion;
    list.value.push({
      text: placePrediction?.text.toString() || '',
      value: placePrediction,
    });
    const a = document.createElement('a');
    a.href = '#';
    if (!placePrediction) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      onPlaceSelected(placePrediction);
      setTimeout(() => {
        resultsContainerElement.value?.replaceChildren();
      });
    });
    a.innerText = placePrediction.text.toString();

    const li = document.createElement('li');
    li.appendChild(a);
    resultsContainerElement.value?.appendChild(li);
  });
}

const timeOutId = ref();

const handleAddressInputChange = (event: Event) => {
  clearTimeout(timeOutId.value);
  timeOutId.value = setTimeout(() => {
    makeAutocompleteRequest(event);
  }, 300);
};

function init() {
  resultsContainerElement.value = document.getElementById('results');
  refreshToken();
}

onMounted(() => {
  init();
});
</script>

<style scoped>
#results li a {
  display: block;
  padding: 8px;
  color: #333;
  text-decoration: none;
}

#results li a:hover {
  background-color: #f0f0f0;
}
</style>
