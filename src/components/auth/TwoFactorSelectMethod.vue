<script lang="ts" setup>
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { ref } from 'vue';
import { Available2FAChannels, LoginStage } from '@/services/auth/auth.list';

interface TwoFactorSelectMethodEmits {
  (e: 'selected-method', method: Available2FAChannels): void;

  (e: 'continue', nextStage: LoginStage): void
}

interface LoginStepProps {
  disabled?: boolean
  loading?: boolean
}

const emits = defineEmits<TwoFactorSelectMethodEmits>();
defineProps<LoginStepProps>();

const selectedMethod = ref<Available2FAChannels>();

const selectMethod = (method: Available2FAChannels) => {
  selectedMethod.value = method;
  emits('selected-method', method);
};

const next = () => {
  if (!selectedMethod.value) return;
  emits('continue', LoginStage.QR_CODE);
};
</script>

<template>
  <div>
    <h3 class="text-gray-700 text-l text-center font-bold my-4">
      Set up 2FA-Authentication
    </h3>
    <div
      :class="selectedMethod === Available2FAChannels.GOOGLE_AUTHENTICATOR ? 'border-primary' : 'border-gray-200'"
      class="flex items-center justify-between p-4 border rounded-xl mb-2 cursor-pointer"
      @click="selectMethod(Available2FAChannels.GOOGLE_AUTHENTICATOR)"
    >
      <div class="flex items-center text-base text-gray-700">
        <Icon :icon="Icons.GOOGLE_AUTHENTICATION" class="mr-2" size="24" />
        Google Authenticator
      </div>
      <Icon :icon="Icons.CHEVRON_RIGHT" class="mr-2 text-gray-400" size="14" />
    </div>
    <div
      :class="selectedMethod === Available2FAChannels.TELEGRAM ? 'border-primary' : 'border-gray-200'"
      class="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer"
      @click="selectMethod(Available2FAChannels.TELEGRAM)"
    >
      <div class="flex items-center text-base text-gray-700">
        <Icon :icon="Icons.TELEGRAM" class="mr-2" size="24" />
        Telegram
      </div>
      <Icon :icon="Icons.CHEVRON_RIGHT" class="mr-2 text-gray-400" size="14" />
    </div>
    <a-button
      :disabled="!selectedMethod"
      :loading="loading"
      class="mt-3 h-10 w-full text-sm"
      type="primary"
      @click="next"
    >Continue
    </a-button>
  </div>
</template>
