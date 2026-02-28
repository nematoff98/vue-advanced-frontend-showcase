import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// import { DEFAULT_DATE_TIME_FORMAT } from '@/services/general';
export const DEFAULT_DATE_TIME_FORMAT = 'MMM DD, HH:mm';
export const DEFAULT_TIME_FORMAT = 'HH:mm';
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export const formattedDate = (date?: string | Date, format?: string) => {
  if (!date) return '';
  return dayjs(date).format(format || DEFAULT_DATE_TIME_FORMAT);
};

export const formatCardExpirationDate = (date: string) => {
  if (date && date.length === 4) {
    return `${date.substring(2)}/${date.substring(0, 2)}`;
  }
  return date;
};

export const getCurrentFormattedDate = (format: string = DEFAULT_DATE_TIME_FORMAT) => dayjs().format(format);

export const extractTime = (dateString: string): string => {
  dayjs.extend(customParseFormat);
  if (!dateString) return '';

  const date = dayjs(
    dateString,
    [
      'YYYY-MM-DD HH:mm:ss', // eski format
      'DD/MM/YYYY HH:mm:ss', // yangi format
    ],
    true, // strict mode
  );

  return date.isValid()
    ? date.format(DEFAULT_TIME_FORMAT)
    : '';
};

export const isPastDate = (date?: string | Date) => {
  if (!date) return false;

  const d = dayjs(date);
  if (!d.isValid()) return false;

  return d.isBefore(dayjs(), 'day');
};
