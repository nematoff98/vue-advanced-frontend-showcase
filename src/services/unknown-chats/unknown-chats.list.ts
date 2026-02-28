export enum ChatMessageMediaType {
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
  SHEETS = 'sheets',
  DOCS = 'docs',
  CSV = 'csv',
  SLIDES = 'slides',
  TEXT = 'text',
  CALL = 'call',
  LOCATION = 'location',
  UNKNOWN = 'unknown',
}

export enum UnknownChatResponsible {
  AI = 'ai',
  WORKER = 'worker',
}

export enum ParticipantType {
  UNKNOWN = 'unknown',
  DRIVER = 'driver',
}

export enum UnknownChatLastMessageType {
  CALL = 'call',
  AUDIO = 'audio',
  LOCATION = 'location',
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
  DOCS = 'docs',
}

export enum UnknownChatLastStatus {
  QUEUED = 'queued',
  COMPLETED = 'completed',
  ANSWERED = 'answered',
  NO_ANSWER = 'no-answer',
  FAILED = 'failed',
  BUSY = 'busy',
  MISSED = 'missed',
  SENT = 'sent',
  RECEIVED = 'received',
  DELIVERED = 'delivered',
  ACCEPTED = 'accepted',
  CLICKED = 'clicked',
  UNSUBSCRIBED = 'unsubscribed',
  REJECTED = 'rejected',
  COMPLAINED = 'complained',
  OPEN = 'open'
}
