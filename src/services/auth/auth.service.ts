import { ApiServiceInstance } from '@/services/api.service';
import { UserInfo } from '@/services/user';
import { AuthLoginResponse, AuthRequestForm, TwoFAMethodParams } from './auth.interface';

class AuthService {
  private httpClient = ApiServiceInstance;

  public async authLogin(form: AuthRequestForm): Promise<AuthLoginResponse> {
    const { data } = await this.httpClient.post('/auth/login', form);
    return data;
  }

  public async logout() {
    await this.httpClient.post('/auth/logout');
  }

  public async getCurrentUser(): Promise<UserInfo> {
    return await this.httpClient.get('/profile/me');
  }

  public async save2FAMethod(params: TwoFAMethodParams) {
    const { data } = await this.httpClient.post('/auth/save-2fa-method', params);
    return data;
  }

  public async getQRCode(token: string): Promise<string> {
    const { data } = await this.httpClient.post(`/auth/get-qr-image/${token}`);
    return data.qrImage;
  }

  public async sendCode(token: string, code: string): Promise<AuthLoginResponse> {
    const { data } = await this.httpClient.post('/auth/verify', { token, code });
    return data;
  }
}

export const AuthServiceInstance = new AuthService();
