import { AuthTokenType, Available2FAChannels } from '@/services/auth/auth.list';

export interface AuthRequestForm {
  email?: string
  password?: string
  code?: string
}

export interface AuthLoginResponse {
  token: string,
  is2FASend: boolean,
  is2FAEnabled: boolean,
  authTokenType: AuthTokenType,
  availableChannels: Available2FAChannels[],
  qrCodeBase64Data: string
}

export interface TwoFAMethodParams {
  token: string
  method: string
  contact?: string
}
