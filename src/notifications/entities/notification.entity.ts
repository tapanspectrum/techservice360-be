import { Document } from 'mongoose';
import { NotificationStatus, NotificationType } from '../notifications.constants';

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
