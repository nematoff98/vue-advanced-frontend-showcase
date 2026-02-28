import {
  ChatContactType,
  ChatMessageAttachmentType, ChatMessageType, ChatResponsible, CommunicationProviders, MessageChannel, MessageDirection, MessageSender, MessageStatus, ParticipantType, TemplateMessageStatus,
} from '@/services/chat';
import { LeadStatus } from '@/services/lead';
import { ChatMessageMediaType } from '@/services/unknown-chats/unknown-chats.list';

export interface LastMessage {
  message: string
  type: ChatMessageType
  date: string
  fromMe: boolean
  status: MessageStatus
  messageType: string
}

export interface ChatUserContact {
  id?: number,
  provider?: CommunicationProviders,
  contact: string,
  isDefault?: boolean,
  channel: MessageChannel,
}

export interface Chat {
  id: number;
  leadId: number;
  isPinned: boolean;
  vehicleImage: string;
  phone: string;
  leadNumber: number;
  leadPhone: string;
  leadStatus: LeadStatus;
  unreadMessagesCount: number;
  lastMessage: LastMessage | null
  leadFullName: string;
  fullName: string;
  profileName: string;
  contact: string;
  contactType: ChatContactType;
}

interface ChatFullInfoUnknownContact {
  id: number
  email: string
  phone: string
}

export interface ChatFullInfo {
  brokerName: string
  chatContacts: ChatUserContact[]
  id: number
  isReminderEnabled: boolean
  lastMessageChannel: string
  leadNumber: number
  leadId?: number
  participantId: number
  participantType: ParticipantType
  responsible: ChatResponsible
  leadFullName?: string
  leadPhone?: string
  profileName?: string
  unknownContact: ChatFullInfoUnknownContact
}

export interface FetchChatsParams {
  search?: string;
  responsible?: ChatResponsible;
  leadStatus?: LeadStatus;
  notAnswered?: boolean;
  unread?: boolean;
  unspecifiedPrice?: boolean;
  userAgree?: boolean;
  page?: number
  perPage?: number
}

export interface FetchChatsParamsExternal {
  search?: string;
  responsible?: ChatResponsible;
  lead_status?: LeadStatus;
  not_answered?: boolean;
  unread?: boolean;
  unspecified_price?: boolean;
  user_agree?: boolean;
  page?: number
  per_page?: number
}

export interface Attachments {
  id?: number,
  chatMessageId?: number,
  fileUrl: string,
  fileType: ChatMessageAttachmentType,
  fileSize: number
  fileName: string
}

export interface ChatMessageSender {
  senderId: number,
  name: string,
}

export interface ChatMessageReplyMessage {
  id: number,
  message: string,
  messageType: ChatMessageType,
  mediaType: ChatMessageMediaType
  sender: MessageSender,
  fileUrl: string,
}

export interface ChatMessage {
  answeredBy?: ChatResponsible;
  attachments?: Attachments[];
  channel?: MessageChannel;
  createdAt: string;
  direction?: MessageDirection;
  duration?: number;
  formattedDateLabel?: string;
  showLabel?: boolean;
  errorMessage?: string;
  id?: number | string;
  message: string;
  chatId: number;
  messageType: ChatMessageType;
  replyMessage?: ChatMessageReplyMessage;
  sender: MessageSender;
  senderUser?: ChatMessageSender;
  status?: MessageStatus;
  contact?: string;
}

export interface ChatMessageSocket extends ChatMessage {
  participantType: ParticipantType,
  chatMessageId: number
  chat: Chat
}

export interface SendMessageFormState {
  chat_id: number;
  message: string;
  channel: MessageChannel
  attachments?: File[]
  status?: string
  subject?: string
  messageTemplateId?: number
}

export interface TempMessage {
  // todo: can we replace it with ChatMessage ???
  message?: string
  attachments?: Attachments[]
  subject?: string
  files?: BinaryData[]
  messageTemplateId?: number
}

export interface MessageTemplate {
  id: number
  name: string
  body: string
  triggerText: string
  trigger: string
  subject: string
  status: TemplateMessageStatus
  channel: MessageChannel
}

export interface GetChatMessagesParams {
  chat_id: number;
  page?: number;
  per_page?: number;
  reverse?: number;
}

export interface AudioMessageTranscript {
  message: string;
  sender: MessageSender;
  transcriptTime: string
}
