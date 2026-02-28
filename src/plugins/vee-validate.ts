/* eslint-disable camelcase */

import { defineRule, configure } from 'vee-validate';
import {
  email, max, min, min_value, max_value, numeric, required, length,
} from '@vee-validate/rules';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
defineRule('min_value', min_value);
defineRule('max_value', max_value);
defineRule('numeric', numeric);
defineRule('length', length);
defineRule('phone', (value: unknown) => {
  if (!value || (typeof value === 'string' && value.length !== 10)) {
    return 'Enter a valid phone number.';
  }
  return true;
});
configure({
  generateMessage: (ctx) => {
    const param = (index = 0) => (Array.isArray(ctx.rule?.params) ? String(ctx.rule?.params[index]) : '');

    const messages: Record<string, string> = {
      required: `${ctx.field} is required.`,
      email: 'Please enter a valid email address.',
      min: `${ctx.field} must be at least ${param(0)} characters.`,
      max: `${ctx.field} must be at most ${param(0)} characters.`,
      min_value: `${ctx.field} must be greater than or equal to ${param(0)}.`,
      max_value: `${ctx.field} must be less than or equal to ${param(0)}.`,
      numeric: `${ctx.field} must be a number.`,
      length: `${ctx.field} must be exactly ${param(0)} characters.`,
    };

    return messages[ctx.rule?.name ?? ''] || `${ctx.field} is not valid.`;
  },
});
