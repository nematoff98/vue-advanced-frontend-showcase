<script setup lang="ts">
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { copyToClipboard } from '@/utils';
import { ref } from 'vue';
import { LoginStage } from '@/services/auth';

const TELEGRAM_LINK = 'https://t.me/berocker_bot';

interface QrCodeProps {
  googleQrCode: string;
  loading?: boolean
}

interface QrCodeEmits {
  (e: 'continue', stage: LoginStage): void
}

const props = defineProps<QrCodeProps>();
const emits = defineEmits<QrCodeEmits>();

const copied = ref(false);

const copyQR = (value: string) => {
  copyToClipboard(value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 3000);
};

const next = () => {
  if (props.googleQrCode) emits('continue', LoginStage.ENTER_CODE);
  else emits('continue', LoginStage.ENTER_CHAT_ID);
};
</script>

<template>
  <div>
    <div
      class="text-l text-gray-700 text-center mt-4 mb-3"
    >
      {{ googleQrCode ? 'Scan this code using Google Authenticator' : 'Scan telegram bot QR-code & follow instructions' }}
    </div>
    <img
      v-if="googleQrCode"
      :src="googleQrCode"
      alt=""
      class="w-[180px] h-[180px] mx-auto"
    >
    <img
      v-else
      src="@/assets/images/telegram-qr.png"
      alt=""
      class="w-[180px] h-[180px] mx-auto"
    >
    <div
      v-if="googleQrCode"
      class="flex items-center justify-center text-primary gap-1 cursor-pointer"
      @click="copyQR(googleQrCode)"
    >
      <span v-if="!copied">or copy link</span>
      <span v-else>copied</span>
      <Icon v-if="!copied" :icon="Icons.COPY" />
      <Icon v-else :icon="Icons.CHECK" />
    </div>
    <div
      v-else
      class="flex items-center justify-center text-primary gap-1 cursor-pointer"
      @click="copyQR(TELEGRAM_LINK)"
    >
      <span v-if="!copied">or copy link</span>
      <span v-else>copied</span>
      <Icon v-if="!copied" :icon="Icons.COPY" />
      <Icon v-else :icon="Icons.CHECK" />
    </div>
    <a-button
      type="primary"
      class="mt-3 h-10 w-full text-sm"
      :loading="loading"
      @click="next"
    >Continue</a-button>
  </div>
</template>
