<script setup lang="ts">
import { ref, watch } from 'vue';
import { Address, LeadAddress } from '@/services/lead-address';
import { Modal } from 'ant-design-vue';

interface Props {
  open: boolean
  addresses?: LeadAddress
}

interface Emits {
  (e: 'update:open', value: boolean): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const modal = ref(false);
const loading = ref(false);
const openMap = ref(false);
const originAddress = ref<Address>();
const destinationAddress = ref<Address>();
const center = ref({ lat: 44.182205, lng: -84.506836 });
const flightPlanCoordinates = ref([]);
const map = ref<google.maps.Map | null>(null);

// let map
const directionsService = ref<google.maps.DirectionsService | null>(null);
const directionsRenderer = ref<google.maps.DirectionsRenderer | null>(null);

async function initMap() {
  const { Map } = await google.maps.importLibrary('maps') as typeof google.maps;
  directionsService.value = new google.maps.DirectionsService();
  directionsRenderer.value = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: '#ff0000', // Change the color of the route line
      strokeOpacity: 0.7, // Change the opacity of the route line
      strokeWeight: 4, // Change the thickness of the route line
    },
    suppressMarkers: false, // Set to true if you don't want to show the default A and B markers
  });

  const mapElement = document.getElementById('map');
  if (!mapElement) return;
  map.value = new Map(mapElement, {
    zoom: 4,
    center: center.value, // Default center, you can change this
  });

  directionsRenderer.value.setMap(map.value);
}

function geocodeZipCode(zipCode: string) {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: zipCode }, (results, status) => {
      if (status === 'OK' && results?.length) {
        resolve(results[0].geometry.location);
      } else {
        reject(new Error(`Geocode failed for ${zipCode}: ${status}`));
      }
    });
  });
}

async function calculateAndDisplayRoute() {
  loading.value = true;
  try {
    const originCity = originAddress.value?.city;
    const originState = originAddress.value?.state;
    const originZip = originAddress.value?.zip;
    const destinationCity = destinationAddress.value?.city;
    const destinationState = destinationAddress.value?.state;
    const destinationZip = destinationAddress.value?.zip;

    // Concatenate city, state, and zip code
    const originAddressForZip = `${originCity}, ${originState}, ${originZip}`;
    const destinationAddressForZip = `${destinationCity}, ${destinationState}, ${destinationZip}`;

    const originLocation = await geocodeZipCode(originAddressForZip) as string;
    const destinationLocation = await geocodeZipCode(destinationAddressForZip) as string;
    loading.value = false;

    if (!directionsService.value) return;
    directionsService.value.route(
      {
        origin: originLocation,
        destination: destinationLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK' && directionsRenderer.value) {
          directionsRenderer.value.setDirections(response);

          // Display route information
          const route = response?.routes[0].legs[0];
          if (!route?.distance || !route?.duration) return;
          const routeInfo = `
            <div class="flex item-center">
              <p><strong class="font-bold">Distance:</strong> ${route.distance.text}</p>
              <p class="mx-1">|</p>
              <p><strong class="font-bold">Duration:</strong> ${route.duration.text}</p>
            </div>
          `;
          const routeInfoElement = document.getElementById('routeInfo');
          if (!routeInfoElement) return;
          routeInfoElement.innerHTML = routeInfo;
        } else {
          Modal.error({
            title: 'Error',
            content: `Directions request failed due to ${status}`,
          });
        }
      },
    );
  } catch (error) {
    console.error(error);
  }
}

const openModal = async (arg: LeadAddress) => {
  originAddress.value = arg.origin;
  destinationAddress.value = arg.destination;
  modal.value = true;
  openMap.value = true;
  setTimeout(() => {
    initMap();
    calculateAndDisplayRoute();
  }, 500);
};

watch(() => props.open, (val) => {
  if (!val) {
    flightPlanCoordinates.value = [];
    openMap.value = false;
  } else if (props.addresses && val) {
    openModal(props.addresses);
  }
});
</script>

<template>
  <a-modal
    width="850px"
    :open="open"
    :mask-closable="false"
    closable
    :footer="false"
    title="View map"
    @update:open="emit('update:open', $event)"
  >
    <div id="map" style="width: 100%; height: 400px" />
    <div
      id="routeInfo"
      class="mt-2"
      style="max-width: 400px; width: 100%"
    />
  </a-modal>
</template>
