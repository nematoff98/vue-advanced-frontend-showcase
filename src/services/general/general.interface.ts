import { RuleObject } from 'ant-design-vue/lib/form';
import { Icons } from '@/components/icon/helpers';

export interface FormError<T = Record<string, never>> {
  message?: string,
  errors?: Record<keyof T, string[]>
}

export interface PageableApiResponse<T> {
  items: T[];
  totalCount: number
  currentPage?: number
  perPage?: number
  hasMorePages?: boolean
}

export interface PageableRequestParams {
  page?: number;
  perPage?: number;
}

export interface SelectOption<T> {
  label: string,
  value: T,
  disabled?: boolean,
}

export type FormRules<T> = {
  [k in (keyof T)]?: RuleObject[]
}

export interface CustomColoredLabel {
  text?: string,
  color?: string,
  bgColor?: string,
}

export interface StyledIcon {
  icon: Icons,
  style: string,
}
