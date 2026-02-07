import { Document } from 'mongoose';

export enum NotificationType {
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered',
}

export interface INotification extends Document {
  type: NotificationType;
  recipient: string;
  message: string;
  subject?: string;
  status: NotificationStatus;
  clientId?: string;
  referenceId?: string;
  template?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
