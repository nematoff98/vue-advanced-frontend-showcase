import { SelectOption } from '@/services/general';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

export const userStatusOptions: SelectOption<UserStatus>[] = [
  {
    label: 'Active',
    value: UserStatus.ACTIVE,
  },
  {
    label: 'Inactive',
    value: UserStatus.INACTIVE,
  },
  {
    label: 'Blocked',
    value: UserStatus.BLOCKED,
  },
];
