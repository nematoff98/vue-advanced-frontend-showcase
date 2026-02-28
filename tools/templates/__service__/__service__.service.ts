import { ApiServiceInstance } from '@/services/api.service';
import { __service__(pascalCase) } from './__service__.interface';

class __service__(pascalCase)Service {
  private httpClient = ApiServiceInstance;

  public async get__service__(pascalCase)Data(): Promise<__service__(pascalCase)> {
    return await this.httpClient.get('/__service__(kebabCase)');
  }
}

export const __service__(pascalCase)ServiceInstance = new __service__(pascalCase)Service();
