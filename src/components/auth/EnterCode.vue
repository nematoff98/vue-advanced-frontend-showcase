<script setup lang="ts">
import VOtpInput from 'vue3-otp-input';
import { ref } from 'vue';

interface EnterAuthenticateCodeProps {
  errorMessage?: string;
  loading?: boolean;
}
interface EnterAuthenticateCodeEmits {
  (e: 'complete', code: string): void;
}

defineProps<EnterAuthenticateCodeProps>();
const emits = defineEmits<EnterAuthenticateCodeEmits>();

const code = ref<string>();

const send = () => {
  if (code.value) emits('complete', code.value);
};
</script>

<template>
  <h3 class="text-lg font-bold text-gray-700 mb-4 text-center">Enter code from Google Authenticator</h3>
  <div class="max-w-[324px] mx-auto mb-4">
    <v-otp-input
      ref="otpInput"
      input-classes="otp-input"
      :conditionalClass="[
        'otp-input one',
        'otp-input two',
        'otp-input three',
        'otp-input four',
        'otp-input five',
        'otp-input six',
      ]"
      separator=" "
      input-type="number"
      inputmode="numeric"
      type="number"
      class="max-w-full justify-between"
      :class="{ 'ant-input-status-error': errorMessage }"
      :num-inputs="6"
      v-model:value="code"
      :should-auto-focus="true"
      :should-focus-order="true"
    />
    <span
      v-if="errorMessage"
      class="text-xs text-red-400"
    >{{ errorMessage }}</span>
  </div>
  <a-button
    type="primary"
    class="mt-3 h-10 w-full text-sm"
    :loading="loading"
    @click="send"
  >Continue</a-button>
</template>

<style lang="scss">
.otp-input {
  max-width: 44px;
  height: 44px;
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  text-align: center;
}

.ant-input-status-error {
  .otp-input {
    border-color: var(--color-red-400);
  }
}
</style>
