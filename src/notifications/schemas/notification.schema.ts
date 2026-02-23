import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationStatus, NotificationType } from '../notifications.constants';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ type: String, enum: Object.values(NotificationType), required: true })
  type: NotificationType;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  subject?: string;

  @Prop({
    type: String,
    enum: Object.values(NotificationStatus),
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Prop()
  clientId?: string;

  @Prop()
  referenceId?: string;

  @Prop()
  template?: string;

  @Prop({ type: Date })
  sentAt?: Date;

  @Prop({ type: Date })
  deliveredAt?: Date;

  @Prop()
  failureReason?: string;
}

export interface NotificationDocument extends Document {
  tenantId: string;
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

NotificationSchema.index({ tenantId: 1, status: 1 });
NotificationSchema.index({ tenantId: 1, type: 1 });
NotificationSchema.index({ clientId: 1 });
NotificationSchema.index({ recipient: 1 });
