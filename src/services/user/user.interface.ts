import { UserStatus } from '@/services/user/user.lists';
import { PageableRequestParams } from '@/services/general';
import { ChatUserContact } from '@/services/chat';

export interface User {
  id: number
  name: string
  email: string
  roles: string
  permissions: string
  loginSessions: string
  isTwoFactorEnabled: string
  availableProviders: string[]
}

export interface UserCallProviders {
  ringcentral: boolean
  telnyx: boolean
  twilio: boolean
  vonage: boolean
}

export interface UserPriceAccess {
  berockerAI: boolean
  centralDispatch: boolean
  supperDispatch: boolean
}

export interface UserInfo {
  id: number
  name: string
  profileName: string
  contactsNotAdded: boolean
  email: string
  teamName: string
  roles: string[]
  createdAt: string
  hasOrganizationOceanShipping: boolean
  lastActiveAt: string
  status: UserStatus
  permissions: string[]
  loading: boolean
  isLeadsEnabledForToday: boolean
  callProviders: UserCallProviders
  userCallContacts: ChatUserContact[]
  priceAccess: UserPriceAccess
}

export interface FetchUsersParams extends PageableRequestParams{
  role?: string
  search?: string
  status?: UserStatus
}

export interface CreateUserForm {
  email?: string
  name?: string
  profileName?: string
  password?: string
  is2faRequired?: boolean
  teamId?: number
  roleId?: number
}

export interface CreateUserFormExternal {
  email?: string
  name?: string
  profile_name?: string
  password?: string
  is_2fa_required?: boolean
  team_id?: number
  role_id?: number
}

export interface UserSalaryConfigForm {
  rangeAmountFrom?: number
  rangeAmountTo?: number
  percentageAmount?: number
}

export interface UserSalaryResponse {
  rangeAmountFrom: number
  rangeAmountTo: number
  percentageAmount: number
}

export interface UserSalaryForm {
  userId?: number
  fixedSalary?: number
  shareholdingFee?: number
  salaryConfigs?: UserSalaryConfigForm[]
}

export interface UserSalaryConfigFormExternal {
  range_amount_from?: number
  range_amount_to?: number
  percentage_amount?: number
}

export interface UserSalaryFormExternal {
  user_id?: number
  fixed_salary?: number
  shareholding_fee?: number
  salary_configs?: UserSalaryConfigFormExternal[]
}

export interface ResponseAfterCreateUser {
  id: number
  name: string
  email: string
  roles: string
  permissions: string
  loginSessions: string
  isTwoFactorEnabled: string
  availableProviders: string[];
}

export interface UserListWithoutPagination {
  id: number
  name: string
}
