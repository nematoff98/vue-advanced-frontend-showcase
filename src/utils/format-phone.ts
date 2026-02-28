// export function formatPhoneNumber(phone: string): string {
//   if (!phone) return '-';
//   const cleaned = phone.replace(/\D/g, '');
//
//   let result = '';
//
//   if (cleaned.length > 0) {
//     result += `(${cleaned.substring(0, Math.min(3, cleaned.length))}`;
//   }
//   if (cleaned.length >= 4) {
//     result += `) ${cleaned.substring(3, Math.min(6, cleaned.length))}`;
//   }
//   if (cleaned.length >= 7) {
//     result += `-${cleaned.substring(6, Math.min(10, cleaned.length))}`;
//   }
//
//   return result;
// }

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '-';

  const cleaned = phone.replace(/\D/g, '');

  let countryCode = '';
  let number = cleaned;

  // US country code support
  if (cleaned.length > 10 && cleaned.startsWith('1')) {
    countryCode = '1 ';
    number = cleaned.substring(1);
  }

  const areaCode = number.substring(0, 3);
  const centralOfficeCode = number.substring(3, 6);
  const lineNumber = number.substring(6, 10);

  let result = '';

  if (areaCode) {
    result += `(${areaCode}`;
    if (areaCode.length === 3) result += ')';
  }

  if (centralOfficeCode) {
    result += ` ${centralOfficeCode}`;
  }

  if (lineNumber) {
    result += `-${lineNumber}`;
  }

  return `${countryCode}${result}`.trim();
}
