import { IsString, IsOptional, IsEnum, IsPhoneNumber, IsArray } from 'class-validator';

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

export class CreateNotificationDto {
  @IsString()
  tenantId: string;
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  recipient: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsEnum(NotificationStatus)
  status: NotificationStatus;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsString()
  template?: string;
}
