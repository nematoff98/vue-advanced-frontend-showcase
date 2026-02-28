import { ApiServiceInstance } from '@/services/api.service';
import { PageableApiResponse } from '@/services/general';
import { userFormExternalMapper, userSalaryFormExternalMapper } from '@/services/user/user.mapper';
import {
  CreateUserForm, FetchUsersParams, ResponseAfterCreateUser, UserInfo, UserListWithoutPagination, UserSalaryForm, UserSalaryResponse,
} from './user.interface';

class UserService {
  private httpClient = ApiServiceInstance;

  public async getUsers(params?: FetchUsersParams): Promise<PageableApiResponse<UserInfo>> {
    return this.httpClient.get('/users', params);
  }

  public async getUsersWithoutPagination(): Promise<UserListWithoutPagination[]> {
    return this.httpClient.get('/users/list/get-users-for-selection');
  }

  public async getSingleUser(userId: number): Promise<UserInfo> {
    return this.httpClient.get(`/users/${userId}`);
  }

  public async getUserSalary(userId: number): Promise<UserSalaryResponse[]> {
    return this.httpClient.get(`users/${userId}/salary-configuration`);
  }

  public async createUser(form: CreateUserForm): Promise<ResponseAfterCreateUser> {
    const { data } = await this.httpClient.post('/users', userFormExternalMapper(form));
    return data;
  }

  public async updateUser(userId: number, form: CreateUserForm): Promise<ResponseAfterCreateUser> {
    const { data } = await this.httpClient.put(`/users/${userId}`, userFormExternalMapper(form));
    return data;
  }

  public async salaryConfig(form: UserSalaryForm) {
    return await this.httpClient.post('/users/salary-configuration', userSalaryFormExternalMapper(form));
  }

  public async toggleDistributionsStatus(userId: number) {
    return await this.httpClient.put(`/users/distributions/${userId}/toggle-status`);
  }
}

export const UserServiceInstance = new UserService();
