import { nextTick } from 'vue';

export function useScrollToMessage() {
  const scrollToMessage = async (messageId: number, dataMessageId = 'data-message-id') => {
    await nextTick();

    const element = document.querySelector(`[${dataMessageId}="${messageId}"]`);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await nextTick();

      element.classList.add('chat-highlight');
      setTimeout(() => {
        element.classList.remove('chat-highlight');
      }, 1000);
    } else {
      console.warn(`❌ Message id not found [${messageId}]`);
    }
  };

  return { scrollToMessage };
}
