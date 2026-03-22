import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  READ = 'read',
}

export interface NotificationDocument extends Document {
  type: NotificationType;
  recipient: string;
  message: string;
  subject?: string;
  status: NotificationStatus;
  isChecked: boolean;
  clientId?: string;
  referenceId?: string;
  template?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ required: true, trim: true })
  recipient: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ trim: true })
  subject?: string;

  @Prop({ enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Prop({ default: false })
  isChecked: boolean;

  @Prop({ trim: true })
  clientId?: string;

  @Prop({ trim: true })
  referenceId?: string;

  @Prop({ trim: true })
  template?: string;

  @Prop()
  sentAt?: Date;

  @Prop()
  deliveredAt?: Date;

  @Prop({ trim: true })
  failureReason?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
