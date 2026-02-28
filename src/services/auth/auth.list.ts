export enum AuthTokenType {
  BEARER = 'bearer',
  TWO_FA_TOKEN = '2fa_token'
}

export enum Available2FAChannels {
  TELEGRAM = 'telegram',
  GOOGLE_AUTHENTICATOR = 'google_authenticator'
}

export enum LoginStage {
  LOGIN = 'login',
  SELECT_METHOD = 'select_method',
  QR_CODE = 'qr_code',
  ENTER_CHAT_ID = 'enter_chat_id',
  ENTER_CODE = 'enter_code'
}
