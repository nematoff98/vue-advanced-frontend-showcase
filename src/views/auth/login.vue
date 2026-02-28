<script lang="ts" setup>
import TwoFactorSelectMethod from '@/components/auth/TwoFactorSelectMethod.vue';
import LoginFormCard from '@/components/auth/LoginFormCard.vue';
import EnterChatId from '@/components/auth/EnterChatId.vue';
import LoginStep from '@/components/auth/LoginStep.vue';
import EnterCode from '@/components/auth/EnterCode.vue';
import QrCode from '@/components/auth/QrCode.vue';
import router from '@/router';
import {
  AuthLoginResponse, AuthServiceInstance, Available2FAChannels, LoginStage,
} from '@/services/auth';
import { STORAGE_AUTH_TOKEN } from '@/utils/constants';
import { notification } from 'ant-design-vue';
import { useCookies } from 'vue3-cookies';
import { computed, onMounted, ref } from 'vue';
import { FormError } from '@/services/general';
import { Routes } from '@/router/router.links';
import { useChatStore } from '@/stores/useChatStore';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum, STORAGE_KEYS } from '@/utils/permission/enums';
import { useCurrentUserStore } from '@/stores/useCurrentUser';
import { stopPusher } from '@/plugins/pusher';

const { DASHBOARD, CHATS } = Routes;

const { cookies } = useCookies();
const chatStore = useChatStore();
const currentUser = useCurrentUserStore();
const $can = useCan();

const stages: LoginStage[] = Object.values(LoginStage);
const qrCodeImg = ref('');

const activeIndex = ref(0);

const activeStep = computed(() => activeIndex.value - 1);
const token = ref<string>('');
const code = ref<string>('');
const selected2FAMethod = ref<Available2FAChannels>();
const continueLoading = ref(false);
const codeErrorMessage = ref('');
const qrType = ref<Available2FAChannels>();
const currentStage = ref<LoginStage>(LoginStage.LOGIN);

const stage = computed(() => stages[activeIndex.value]);

const twoFactoryEnable = (data: AuthLoginResponse) => {
  if (!data.is2FASend && data.is2FAEnabled) {
    currentStage.value = LoginStage.SELECT_METHOD;
    token.value = data.token;
    activeIndex.value = 1;
  }
};

const selectedMethod = async (method: Available2FAChannels) => {
  if (method === Available2FAChannels.TELEGRAM) qrType.value = Available2FAChannels.TELEGRAM;
  else qrType.value = Available2FAChannels.GOOGLE_AUTHENTICATOR;

  selected2FAMethod.value = method;
};

const send2FAMethod = async (contact?: string) => {
  if (!selected2FAMethod.value) return;
  continueLoading.value = true;
  try {
    const data = await AuthServiceInstance.save2FAMethod({
      token: token.value,
      method: selected2FAMethod.value,
      contact,
    });
    token.value = data.token;
    currentStage.value = LoginStage.ENTER_CODE;
  } catch (err) {
    notification.error({
      message: 'Error',
      description: (err as FormError).message,
    });
  } finally {
    continueLoading.value = false;
  }
};

const getQrCode = async () => {
  continueLoading.value = true;
  try {
    qrCodeImg.value = await AuthServiceInstance.getQRCode(token.value);
  } catch (err) {
    console.error(err);
  } finally {
    continueLoading.value = false;
  }
};

const sendCode = async () => {
  continueLoading.value = true;
  try {
    const data = await AuthServiceInstance.sendCode(token.value, code.value);
    if (data.token) {
      if (data.token) cookies.set(STORAGE_AUTH_TOKEN, data.token);
      await currentUser.fetchCurrentUser();
      if ($can(PermissionEnum.GET_CHATS_LIST)) await router.push({ name: CHATS.name });
      else await router.push({ name: DASHBOARD.name });
    }
  } catch (err) {
    codeErrorMessage.value = 'The code may be incorrect, please try again.';
  } finally {
    continueLoading.value = false;
  }
};

const codeComplete = (value: string) => {
  code.value = value;
  codeErrorMessage.value = '';
  sendCode();
};

const next = async (nextStage: LoginStage) => {
  if (nextStage === LoginStage.QR_CODE) {
    if (selected2FAMethod.value === Available2FAChannels.GOOGLE_AUTHENTICATOR) {
      await getQrCode();
      currentStage.value = LoginStage.QR_CODE;
      activeIndex.value = 2;
    } else if (selected2FAMethod.value === Available2FAChannels.TELEGRAM) {
      currentStage.value = LoginStage.QR_CODE;
      activeIndex.value = 2;
    }
  } else if (nextStage === LoginStage.ENTER_CODE) {
    currentStage.value = LoginStage.ENTER_CODE;
    await send2FAMethod();
    activeIndex.value = 3;
  } else if (nextStage === LoginStage.ENTER_CHAT_ID) {
    currentStage.value = LoginStage.ENTER_CHAT_ID;
    activeIndex.value = 3;
  }
};

onMounted(() => {
  localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
  chatStore.clearChatStore();
  stopPusher();
});
</script>

<template>
  <div
    class="login bg-gray-100 flex items-center justify-center h-screen"
  >
    <LoginFormCard
      v-if="currentStage === LoginStage.LOGIN"
      @two-fa-send="twoFactoryEnable"
    />
    <LoginStep
      v-if="currentStage !== LoginStage.LOGIN"
      :disabled="(stage === LoginStage.ENTER_CODE && !code) || (stage === LoginStage.SELECT_METHOD && !selected2FAMethod)"
      :loading="continueLoading"
      :step="activeStep"
    >
      <TwoFactorSelectMethod
        v-if="currentStage === LoginStage.SELECT_METHOD"
        :loading="continueLoading"
        @continue="next"
        @selected-method="selectedMethod"
      />
      <QrCode
        v-if="currentStage === LoginStage.QR_CODE"
        :google-qr-code="qrCodeImg"
        :loading="continueLoading"
        @continue="next"
      />
      <EnterChatId
        v-if="currentStage === LoginStage.ENTER_CHAT_ID"
        :loading="continueLoading"
        @continue="send2FAMethod"
      />
      <div
        v-if="currentStage === LoginStage.ENTER_CODE"
      >
        <EnterCode
          :error-message="codeErrorMessage"
          :loading="continueLoading"
          @complete="codeComplete"
        />
      </div>
    </LoginStep>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/pages/auth-login";
</style>
