const isValidNumber = (value?: number | null) => value !== undefined && value !== null && !Number.isNaN(value);

export const prepareMoneyValue = (value?: number | null): string => {
  if (!isValidNumber(value)) {
    return '0.00';
  }
  return value?.toLocaleString('en-GB', { minimumFractionDigits: 2 }) || '';
};

export const formatAmount = (value?: number | null, currency: string = 'USD') => {
  const valuePart = prepareMoneyValue(value);

  return `${valuePart} ${currency}`;
};

export const formatAmountShort = (value?: number | null, currencySign: string = '$') => {
  const valuePart = prepareMoneyValue(value);

  return `${currencySign} ${valuePart}`;
};

export function formatPriceWithK(value: number): string {
  if (value < 1000) return `$ ${value}`;

  const formatted = (value / 1000).toPrecision(3);
  return `$ ${formatted}k`;
}
