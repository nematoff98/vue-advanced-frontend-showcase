<script lang="ts" setup>
import { ref, watch } from 'vue';
import { MessageChannel, ChatUserContact } from '@/services/chat';

interface ChatItemContentFormContactProps {
  channelValue?: MessageChannel
  contacts?: ChatUserContact[]
}

interface ChatItemContentFormContactEmits {
  (e: 'update:channelValue', value?: MessageChannel): void
}

const props = defineProps<ChatItemContentFormContactProps>();
defineEmits<ChatItemContentFormContactEmits>();

const channel = ref<MessageChannel>();

watch(() => props.channelValue, (newValue) => {
  channel.value = newValue;
});
</script>

<template>
  <a-select
    ref="select"
    v-model:value="channel"
    :bordered="false"
    class="chat-message-channel max-minMobile:h-7 mr-2 w-16 min-minMobile:w-22 !bg-gray-50 rounded-lg"
    @change="$emit('update:channelValue', channel)"
    :options="contacts"
    :fieldNames="{ label: 'channel', value: 'channel' }"
  />
</template>

<style lang="scss">
.chat-message-channel {
  .ant-select-selector {
    padding: 0 7px!important;
  }
}
</style>
