<template>
  <Field
    v-slot="{ errorMessage }"
    :label="label"
    :model-value="modelValue"
    :name="name"
    :rules="rules"
  >
    <label :for="uniqueId" class="block text-gray-700 font-medium text-sm mb-[6px]">
      {{ label }} <span v-if="rules === 'required'" class="text-primary-600">*</span>
    </label>
    <a-input
      :id="id"
      v-model="value"
      :class="errorMessage ? 'ant-input-status-error' : ''"
      :placeholder="placeholder"
      :value="modelValue"
      v-bind="$attrs"
      @input="(val) => $emit('input', val)"
    />
    <span v-if="errorMessage" class="text-red-500 text-xs mt-1 block">
      {{ errorMessage }}
    </span>
  </Field>
</template>

<script>
import { Field } from 'vee-validate';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'VInputGoogle',
  components: { Field },
  props: {
    id: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Object],
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      timeoutId: null,
      value: '',
    };
  },
  computed: {
    uniqueId() {
      return `${this.name}-${uuidv4()}`;
    },
  },
  mounted() {
    this.timeoutId = setTimeout(this.initGoogleMaps, 1000);
  },
  unmounted() {
    clearTimeout(this.timeoutId);
  },
  methods: {
    initGoogleMaps() {
      const element = document.getElementById(this.id);
      const options = {
        types: ['(regions)'],
        componentRestrictions: { country: 'US' },
        fields: ['address_components', 'geometry'],
      };
      const autocomplete = new window.google.maps.places.Autocomplete(
        element,
        options,
      );

      autocomplete.addListener(
        'place_changed',
        this.onChangeInput.bind(null, autocomplete),
      );
    },
    onChangeInput(input) {
      const place = input.getPlace();
      let state = '';
      let city = '';
      let zip = '';
      if (!place.address_components?.length) {
        console.error('GoogleInput onChangeInput()');
        return;
      }
      for (let i = 0; i < place.address_components.length; i += 1) {
        const component = place.address_components[i];
        const componentType = component?.types[0];
        switch (componentType) {
        case 'administrative_area_level_1': {
          state = component.short_name;
          break;
        }
        case 'locality':
          city = component.long_name;
          break;
        case 'postal_town':
          city = city || component.long_name;
          break;
        case 'administrative_area_level_2':
          city = city || component.long_name;
          break;
        case 'sublocality_level_1':
          city = city || component.long_name;
          break;
        case 'neighborhood':
          city = city || component.long_name;
          break;
        default:
          // console.log(`Unknown component type: ${componentType}`);
          break;
        }
      }
      const geocoder = new window.google.maps.Geocoder();
      const latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK') {
          for (let i = 0; i < results[0].address_components.length; i += 1) {
            const component = results[0].address_components[i];
            const componentType = component.types[0];
            if (componentType === 'postal_code') {
              zip = component.long_name;
              break;
            }
          }
          this.$emit('update:modelValue', `${city} ${state} ${zip}`.trim());
          this.$emit('get-address', {
            city,
            state,
            zip,
          });
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    },
  },
};
</script>
