<script lang="ts" setup>
import BasePasswordInput from '@/components/ui/BasePasswordInput.vue';
import BaseOtpInput from '@/components/ui/BaseOtpInput.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import Icon from '@/components/icon/Icon.vue';
import router from '@/router';
import { AuthLoginResponse, AuthRequestForm, AuthServiceInstance } from '@/services/auth';
import { STORAGE_AUTH_TOKEN } from '@/utils/constants';
import { Icons } from '@/components/icon/helpers';
import { FormError } from '@/services/general';
import { useCookies } from 'vue3-cookies';
import { Form, FormContext } from 'vee-validate';
import { ref } from 'vue';
import { Routes } from '@/router/router.links';
import { PermissionEnum } from '@/utils/permission/enums';
import { useCurrentUserStore } from '@/stores/useCurrentUser';
import { useCan } from '@/utils/permission/can';

const { CHATS, DASHBOARD } = Routes;

const { cookies } = useCookies();
const currentUser = useCurrentUserStore();
const $can = useCan();

interface LoginStepEmits {
  (e: 'two-fa-send', data: AuthLoginResponse): void
}

const emits = defineEmits<LoginStepEmits>();

const getCode = ref(false);
const resendCode = ref(false);
const loading = ref(false);
const token = ref<string>();

const form = ref<FormContext>();

const model = ref<AuthRequestForm>({});

const endTime = () => {
  // todo: complete end time logic
};

const setErrors = (error: FormError, key: string, formRef: FormContext) => {
  let formErrors: Record<string, string | string[]> = {};
  if (error.errors && !Object.keys(error.errors).length && error.message) {
    formErrors[key] = error.message;
  } else {
    formErrors = error.errors || {};
  }
  formRef.setErrors(formErrors);
};

const verifyCode = async () => {
  if (!token.value || !model.value.code) return;
  loading.value = true;
  try {
    const data = await AuthServiceInstance.sendCode(token.value, model.value.code);
    if (data.token) {
      if (data.token) cookies.set(STORAGE_AUTH_TOKEN, data.token);
      await router.push({ name: CHATS.name });
    }
  } catch (err) {
    if (form.value) setErrors(err as FormError, 'code', form.value);
  } finally {
    loading.value = false;
  }
};

const login = async () => {
  if (getCode.value) {
    await verifyCode();
    return;
  }
  loading.value = true;
  try {
    const data = await AuthServiceInstance.authLogin(model.value);
    if (data.is2FAEnabled && !data.is2FASend) {
      emits('two-fa-send', data);
    } else if (!data.is2FAEnabled) {
      if (data.token) cookies.set(STORAGE_AUTH_TOKEN, data.token);
      await currentUser.fetchCurrentUser();
      if ($can(PermissionEnum.GET_CHATS_LIST)) await router.push({ name: CHATS.name });
      else await router.push({ name: DASHBOARD.name });
    } else if (data.is2FAEnabled && data.is2FASend) {
      getCode.value = true;
      token.value = data.token;
    }
  } catch (err) {
    if (form.value) setErrors(err as FormError, 'email', form.value);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div>
    <img
      alt=""
      class="absolute w-full h-full left-0 top-0 md:hidden"
      src="@/assets/images/banner.png"
    >
    <BaseCard class="w-[400px] md:w-[800px] flex overflow-hidden items-center">
      <div class="w-full md:w-1/2 logo-banner absolute md:relative hidden md:block">
        <img alt="" src="@/assets/images/banner.png">
      </div>
      <div class="px-[50px] md:w-1/2 w-full bg-white md:bg-transparent relative pt-10 pb-[50px] md:pt-0 md:pb-0">
        <h1 class="text-2xl font-semibold text-center text-gray-700">Log in to your account</h1>
        <p class="text-gray-400 font-light mt-1 text-center">Welcome back! Enter your details</p>
        <Form
          ref="form"
          class="mt-3"
          @submit="login"
        >
          <BaseInput
            v-model="model.email"
            label="Email"
            name="email"
            placeholder="Enter Email"
            rules="required"
          >
            <template #prefix>
              <Icon :icon="Icons.ACCOUNT" class="mr-2" />
            </template>
          </BaseInput>
          <div class="mt-3">
            <BasePasswordInput
              v-model="model.password"
              label="Password"
              name="password"
              placeholder="Enter Password"
              rules="required"
            >
              <template #prefix>
                <Icon :icon="Icons.LOCK" class="mr-2" />
              </template>
            </BasePasswordInput>
          </div>
          <div class="mt-3">
            <BaseOtpInput
              v-if="getCode"
              v-model:value="model.code"
              :reset="resendCode"
              class="mt-3"
              label="Code"
              name="code"
              rules="required"
              @end-time="endTime"
            />
          </div>
          <a-button
            :loading="loading"
            class="h-10 rounded-[10px] w-full mt-3"
            html-type="submit"
            type="primary"
          >Login
          </a-button>
        </Form>
      </div>
    </BaseCard>
  </div>
</template>
