import { ChatMessage } from '@/services/chat';
import dayjs from 'dayjs';

export const formatDuration = (duration: number): string => {
  if (duration < 60) {
    return `${duration} sec`;
  }

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${seconds} sec`;
};

export function copyToClipboard(text: string): void {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textarea);
  } else {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('Copy to clipboard failed', err);
    });
  }
}

export const formatFileSize = (sizeInBytes: number): string => {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return `${sizeInMB.toFixed(2)} MB`;
};

export const clearNonDigits = (str: string): string => str.replace(/\D/g, '');

export const moneyFormat = (val?: string | number) => {
  if (!val) return '-';
  const num = val ? Math.round(+val * 100) / 100 : null;
  return num ? `$ ${num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}` : '$ 0';
};

export function snakeToTitle(value: string) {
  if (!value) return '';
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w|\s\w/g, (c) => c.toUpperCase());
}

export const customDateFormat = (dateString: string): string => {
  const date = dayjs(
    dateString,
    [
      'YYYY-MM-DD HH:mm:ss', // eski
      'DD/MM/YYYY HH:mm:ss', // yangi
    ],
    true,
  );

  if (!date.isValid()) return 'Invalid date';

  const today = dayjs();

  if (date.isSame(today, 'day')) return 'today';
  if (date.isSame(today.subtract(1, 'day'), 'day')) return 'yesterday';

  const formatted = date.format('D MMMM');

  return date.year() === today.year()
    ? formatted
    : `${formatted} ${date.year()}`;
};

export const prepareMessages = (messages: ChatMessage[]) => {
  const result: (ChatMessage & {
    formattedDateLabel: string;
    showLabel: boolean;
  })[] = [];

  let lastLabel = '';

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i];
    const label = customDateFormat(msg.createdAt);

    const showLabel = label !== lastLabel;
    lastLabel = label;

    result.push({
      ...msg,
      formattedDateLabel: label,
      showLabel,
    });
  }

  return result.reverse();
};

export const getAvatarInitials = (name?: string): string => {
  if (!name) return '';

  return name
    .trim()
    .split(/\s+/) // bo'shliqlar bo'yicha bo'lish
    .slice(0, 2) // faqat birinchi 2 ta so'z
    .map((word) => word[0]?.toUpperCase())
    .join('');
};
