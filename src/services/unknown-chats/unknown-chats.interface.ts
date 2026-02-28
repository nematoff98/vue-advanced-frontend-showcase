import { PageableRequestParams } from '@/services/general';

export interface UnknownChatListParams extends PageableRequestParams {
  search?: string
}

export interface CreateUnknownChatForm {
  profileName?: string;
  phone?: string;
  email?: string;
}

export interface CreateUnknownChatPayloadExternal {
  profile_name?: string;
  phone?: string;
  email?: string;
}

export interface CreateUnknownChatResponse {
  id: number;
  profileName: string;
  participantId: number;
  participantType: string;
  responsible: string;
  createdAt: string;
}
