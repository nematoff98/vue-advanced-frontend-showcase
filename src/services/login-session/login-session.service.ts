import { ApiServiceInstance } from '@/services/api.service';
import { PageableApiResponse } from '@/services/general';
import { LoginSession, LoginSessionsFilter } from './login-session.interface';

class LoginSessionService {
  private httpClient = ApiServiceInstance;

  public async getLoginSessions(params?: LoginSessionsFilter): Promise<PageableApiResponse<LoginSession>> {
    return await this.httpClient.get('/login-sessions', params);
  }
}

export const LoginSessionServiceInstance = new LoginSessionService();
