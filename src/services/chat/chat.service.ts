import { ApiServiceInstance } from '@/services/api.service';
import {
  AudioMessageTranscript, Chat, ChatFullInfo, ChatMessage, FetchChatsParams, GetChatMessagesParams, MessageTemplate,
} from '@/services/chat/chat.interface';
import { PageableApiResponse } from '@/services/general';
import { MessageChannel } from '@/services/chat/chat.list';
import { chatListExternalParams } from '@/services/chat/chat.mapper';

class ChatService {
  private httpClient = ApiServiceInstance;

  public async getChatList(params: FetchChatsParams): Promise<PageableApiResponse<Chat>> {
    return await this.httpClient.get('/auto-logistics/chats', chatListExternalParams(params));
  }

  public async getChat(id: number): Promise<ChatFullInfo> {
    return await this.httpClient.get(`/auto-logistics/chats/${id}`);
  }

  public async getChatMessages(params: GetChatMessagesParams): Promise<PageableApiResponse<ChatMessage>> {
    return await this.httpClient.get('/chats/messages/', params);
  }

  public async sendMessage(message: FormData): Promise<ChatMessage> {
    const { data } = await this.httpClient.post('/chats/send-message', message);
    return data;
  }

  public async getAIMessage(chatId: number): Promise<ChatMessage> {
    return await this.httpClient.get(`/chats/messages/${chatId}/next-ai-message`);
  }

  public async getMessageTemplates(chatId: number, channel: MessageChannel): Promise<MessageTemplate[]> {
    return await this.httpClient.get(
      `/chats/messages/${chatId}/message-templates`,
      { channel },
    );
  }

  public async getMessageTemplateReplacedBody(messageTemplateId: number, leadId: number): Promise<{ body: string, subject: string }> {
    const { data } = await this.httpClient.post(
      `templates/message-templates/${messageTemplateId}/replace-body`,
      { lead_id: leadId },
    );
    return data;
  }

  public async changeReminder(chatId: number): Promise<void> {
    await this.httpClient.post(`/chats/${chatId}/switch-reminder`);
  }

  public async changeResponsibleAi(chatId: number): Promise<void> {
    await this.httpClient.post(`/chats/${chatId}/switch-responsible`);
  }

  public async getAudioMessageTranscript(chatMessageId: number): Promise<AudioMessageTranscript[]> {
    return await this.httpClient.get(`/chats/messages/${chatMessageId}/call-recording-messages`);
  }
}

export const ChatServiceInstance = new ChatService();
