<script setup lang="ts">
import { Icons } from '@/components/icon/helpers';
import Icon from '@/components/icon/Icon.vue';
import {
  computed, createVNode, h, onMounted, ref,
} from 'vue';
import { ChatFullInfo, MessageChannel } from '@/services/chat';
import { FullLeadInfo, LeadServiceInstance } from '@/services/lead';
import { useCallCenterStore } from '@/stores/call/call.center';
import { formatPhoneNumber } from '@/utils/format-phone';
import { useCurrentUserStore } from '@/stores/useCurrentUser';
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined, PhoneOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';
import { addSuccess, colors } from '@/utils';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';

const callCenter = useCallCenterStore();
const currentUser = useCurrentUserStore();
const route = useRoute();
const $can = useCan();

interface ChatItemProps {
  activeChat?: ChatFullInfo
  activeLead?: FullLeadInfo
}

const props = defineProps<ChatItemProps>();

const call = ref();

const contactList = computed(() => {
  const chatCallContacts = props.activeChat?.chatContacts?.filter(
    (c) => c.channel === MessageChannel.CALL,
  ) ?? [];

  const userCallContacts = currentUser.currentUser?.userCallContacts?.filter(
    (c) => c.channel === MessageChannel.CALL,
  ) ?? [];
  const merged: typeof chatCallContacts = [...chatCallContacts];

  userCallContacts.forEach((u) => {
    const alreadyExists = merged.some((m) => m.id === u.id);
    if (!alreadyExists) merged.push(u);
  });

  return merged.map((contact) => ({
    id: contact.id,
    provider: contact.provider,
    contact: contact.contact,
    value: contact.id,
    label: `${formatPhoneNumber(contact.contact)} (${contact.provider})`,
  }));
});

onMounted(() => {
  if (!props.activeLead?.id) return;

  const chatDefault = props.activeChat?.chatContacts?.find(
    (c) => c.isDefault && c.channel === MessageChannel.CALL,
  );

  const userDefault = currentUser.currentUser?.userCallContacts?.find(
    (c) => c.isDefault && c.channel === MessageChannel.CALL,
  );

  const selected = chatDefault ?? userDefault;

  if (selected?.id) {
    call.value = selected.id;
  }
});

const makeCall = () => {
  const contact = contactList.value.find((p) => p.id === call.value);
  if (!props.activeLead || !contact?.id || !contact?.provider) return;
  callCenter.makeCall({
    type: contact?.provider,
    leadInfo: {
      leadId: props.activeLead.id,
      chatId: props.activeChat?.id,
      fullName: props.activeLead.fullName,
      phone: props.activeLead.phone,
      leadNumber: props.activeLead.leadNumber,
    },
    contactId: contact?.id,
    contact: contact?.contact,
  });
};

const startCall = (value?: number) => {
  call.value = value;
  makeCall();
};

const askAiCall = async () => {
  const { leadId } = route.query;
  if (!leadId) return;
  try {
    await LeadServiceInstance.askAiCall(+leadId);
    addSuccess('Successfully!');
  } catch (err) {
    console.error(err);
  }
};

const showConfirm = () => {
  Modal.confirm({
    title: 'Are you sure you want to place a call to the client using the AI assistant?',
    icon: createVNode(ExclamationCircleOutlined),
    content: h('div', [
      'By clicking Call I confirm that I have read and acknowledged the ',
      h(
        'a',
        {
          href: 'https://berocker.com/terms',
          target: '_blank',
          rel: 'noopener noreferrer',
          style: { color: colors.primary[600] },
        },
        'Terms and Conditions.',
      ),
    ]),
    okText: h(
      'span',
      {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        },
      },
      [h(PhoneOutlined), 'Call'],
    ),
    async onOk() {
      await askAiCall();
    },
  });
};
</script>

<template>
  <div class="w-full hidden min-[1400px]:flex items-center chat-message__call">
    <a-select
      class="w-full max-w-[194px] chat-message__call-select"
      placeholder="Phone"
      :options="contactList"
      v-model:value="call"
    />
    <a-button
      type="primary"
      class="chat-message__call-button"
      @click="makeCall"
    >
      <Icon :icon="Icons.PHONE" />
    </a-button>
    <div
      v-if="$can(PermissionEnum.AI_CALL)"
      class="flex items-center justify-center h-[34px] border border-gray-300 rounded-lg w-[40px] ml-2 cursor-pointer active:scale-95 ai__assistant__btn"
      @click="showConfirm"
    >
      <Icon :icon="Icons.AI_CALL" size="28" />
    </div>
  </div>
  <div class="min-[1400px]:hidden">
    <a-dropdown :trigger="['click']">
      <a-button
        type="primary"
        class="w-8 p-0 flex justify-center items-center"
      >
        <Icon :icon="Icons.PHONE" />
      </a-button>
      <template #overlay>
        <a-menu>
          <a-menu-item
            :key="item.id"
            v-for="item in contactList"
            @click="startCall(item.value)"
          >
            {{ item.label }}
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<style  lang="scss">
.dark {
 .ai__assistant__btn {
    g {
      fill: var(--color-white-100) !important;
    }
  }
}
</style>
