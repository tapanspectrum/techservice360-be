import { Schema, SchemaFactory } from '@nestjs/mongoose';
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

@Schema({ timestamps: true })
export class Notification extends Document {
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
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
