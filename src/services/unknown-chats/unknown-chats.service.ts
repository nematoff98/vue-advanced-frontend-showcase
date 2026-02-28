import { ApiServiceInstance } from '@/services/api.service';
import { PageableApiResponse } from '@/services/general';
import { Chat, ChatFullInfo } from '@/services/chat';
import {
  CreateUnknownChatForm,
  CreateUnknownChatResponse,
  UnknownChatListParams,
} from '@/services/unknown-chats/unknown-chats.interface';
import { createUnknownChatExternalMapper } from '@/services/unknown-chats/unknown-chats.mapper';

export class UnknownChatsService {
  private httpClient = ApiServiceInstance;

  public async getUnknownChats(params: UnknownChatListParams): Promise<PageableApiResponse<Chat>> {
    return await this.httpClient.get('/auto-logistics/chats/unknown-chats', params);
  }

  public async assignLead(chatId: number, leadId: number): Promise<void> {
    await this.httpClient.post(`/chats/unknown-chats/${chatId}/assign-lead`, { lead_id: leadId });
  }

  public async getSingleChat(chatId: number): Promise<ChatFullInfo> {
    return await this.httpClient.get(`/auto-logistics/chats/${chatId}`);
  }

  public async createUnknownChat(payload: CreateUnknownChatForm): Promise<CreateUnknownChatResponse> {
    const { data } = await this.httpClient.post('/chats/unknown-chats', createUnknownChatExternalMapper(payload));
    return data;
  }

  public async updateUnknownChat(chatId: number, payload: CreateUnknownChatForm): Promise<CreateUnknownChatResponse> {
    const { data } = await this.httpClient.put(`/chats/unknown-chats/${chatId}`, createUnknownChatExternalMapper(payload));
    return data;
  }
}

export const UnknownChatsServiceInstance = new UnknownChatsService();
