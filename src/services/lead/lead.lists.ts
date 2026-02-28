import { colors, snakeToTitle } from '@/utils';
import { CustomColoredLabel, SelectOption } from '@/services/general';

export enum LeadStatus {
  NEW = 'new',
  ORDER = 'order',
  SIGNED = 'signed',
  PAID = 'paid',
  POSTED = 'posted',
  PICKED_UP = 'picked_up',
  DISPATCHED = 'dispatched',
  ARCHIVED = 'archived',
  DELIVERED = 'delivered',
}

export enum CustomerIdType {
  PASSPORT = 'passport',
  DRIVER_LICENSE = 'driver_license',
  NATIONAL_ID = 'national_id'
}

export enum LeadPaymentMethods {
  CASH = 'cash',
  CHECK = 'check',
  CASHIER_CHECK = 'cashiers_check',
  MONEY_ORDER = 'money_order',
  COMCHECK = 'comcheck',
  CREDIT_CARD = 'credit_card',
  DIRECT_DEPOSIT = 'direct_deposit',
  SUPERPAY = 'superpay',
  OTHER = 'other',
}

export const leadStatusTextMap: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'New',
  [LeadStatus.ORDER]: 'Order',
  [LeadStatus.SIGNED]: 'Signed',
  [LeadStatus.PAID]: 'Paid',
  [LeadStatus.POSTED]: 'Posted',
  [LeadStatus.DISPATCHED]: 'Dispatched',
  [LeadStatus.PICKED_UP]: 'Picked Up',
  [LeadStatus.DELIVERED]: 'Delivered',
  [LeadStatus.ARCHIVED]: 'Archived',
};

export const leadStatusesOptions: SelectOption<LeadStatus | null>[] = [
  { value: null, label: 'All Leads' },
  ...Object.keys(leadStatusTextMap).map((p) => ({
    value: p as LeadStatus,
    label: leadStatusTextMap[p as LeadStatus],
  })),
];

export const leadStatusColorMap: Record<LeadStatus, CustomColoredLabel> = {
  [LeadStatus.NEW]: {
    bgColor: colors.yellow[100],
    color: colors.yellow[700],
  },
  [LeadStatus.ORDER]: {
    bgColor: colors.lime[100],
    color: colors.lime[700],
  },
  [LeadStatus.SIGNED]: {
    bgColor: colors.primary[100],
    color: colors.primary[700],
  },
  [LeadStatus.PAID]: {
    bgColor: colors.lime[100],
    color: colors.lime[700],
  },
  [LeadStatus.POSTED]: {
    bgColor: colors.teal[100],
    color: colors.teal[700],
  },
  [LeadStatus.PICKED_UP]: {
    bgColor: colors.indigo[100],
    color: colors.indigo[700],
  },
  [LeadStatus.DISPATCHED]: {
    bgColor: colors.sky[100],
    color: colors.sky[700],
  },
  [LeadStatus.ARCHIVED]: {
    bgColor: colors.red[100],
    color: colors.red[700],
  },
  [LeadStatus.DELIVERED]: {
    bgColor: colors.green[100],
    color: colors.green[700],
  },
};

export const leadPaymentMethodsOptions: SelectOption<LeadPaymentMethods | null>[] = [
  ...Object.keys(LeadPaymentMethods).map((p) => ({
    value: LeadPaymentMethods[p as keyof typeof LeadPaymentMethods],
    label: snakeToTitle(LeadPaymentMethods[p as keyof typeof LeadPaymentMethods]),
  })),
];

export enum LeadRouteType {
  LEAD_ADDRESS_PORT_TO_PORT = 'port_to_port',
  LEAD_ADDRESSES_PORT_TO_DOOR = 'port_to_door',
  LEAD_ADDRESS_DOOR_TO_PORT = 'door_to_port',
}

export const leadRouteTypeTextMap: Record<LeadRouteType, string> = {
  [LeadRouteType.LEAD_ADDRESS_DOOR_TO_PORT]: 'If origin is door and destination is port',
  [LeadRouteType.LEAD_ADDRESS_PORT_TO_PORT]: 'If origin and destination are ports',
  [LeadRouteType.LEAD_ADDRESSES_PORT_TO_DOOR]: 'If origin is port and destination is door',
};

export const leadRouteTypeOptions: SelectOption<LeadRouteType>[] = Object.values(LeadRouteType)
  .map((value) => ({
    label: leadRouteTypeTextMap[value],
    value,
  }));
