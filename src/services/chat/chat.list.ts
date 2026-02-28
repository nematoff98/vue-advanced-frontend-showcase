import { SelectOption } from '@/services/general';

export enum ChatMessageAttachmentType {
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
  SHEETS = 'sheets',
  DOCS = 'docs',
  CSV = 'csv',
  SLIDES = 'slides',
  TEXT = 'text',
  UNKNOWN = 'unknown',
}

export enum ChatMessageType {
  TEXT = 'text',
  IMAGE = 'image',
  CALL = 'call',
  LOCATION = 'location',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
  PDF = 'pdf',
  DOCS = 'docs'
}

export enum ChatResponsible {
  AI = 'ai',
  WORKER = 'worker',
}

export enum ChatLeadInfoTabs {
  LEAD = 'lead',
  DOCUMENTS = 'documents',
  DRIVERS = 'drivers',
}

export enum MessageSender {
  AI = 'ai',
  WORKER = 'worker',
  CUSTOMER = 'customer',
  AUTO_MESSAGE = 'auto_message'
}

export enum MessageChannel {
  SMS = 'sms',
  CALL = 'call',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  TELEGRAM = 'telegram',
  SLACK = 'slack'
}

export enum CommunicationProviders {
  TWILIO = 'twilio',
  TELEGRAM = 'telegram',
  SLACK = 'slack',
  VONAGE = 'vonage',
  RINGCENTRAL = 'ringcentral',
  OPEN_PHONE = 'open_phone',
  TELNYX = 'telnyx',
  MAILGUN = 'mailgun',
  SENDGRID = 'sendgrid',
  WHATSAPP = 'whatsapp',
}

export enum MessageDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum ParticipantType {
  UNKNOWN = 'unknown',
  DRIVER = 'driver',
  USER = 'user',
  LEAD = 'lead',
  ORGANIZATION = 'organization',
  AUTO_LOGISTICS_LEAD = 'auto_logistics_lead',
}

export enum MessageStatus {
  QUEUED = 'queued',
  COMPLETED = 'completed',
  ANSWERED = 'answered',
  NO_ANSWER = 'no_answer',
  FAILED = 'failed',
  MISSED = 'missed',
  ERROR = 'error',
  DELIVERED = 'delivered',
  WAITING = 'waiting',
}

export enum ChatContactType {
  EMAIL = 'email',
  PHONE = 'phone',
}

export enum TemplateMessageStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export const sendMessageChannelOptions: SelectOption<MessageChannel>[] = [
  {
    value: MessageChannel.SMS,
    label: 'SMS',
  },
  {
    value: MessageChannel.EMAIL,
    label: 'Email',
  },
];
