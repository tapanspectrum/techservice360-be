import { IsString, IsOptional, IsEnum, IsPhoneNumber, IsArray } from 'class-validator';
import { NotificationStatus, NotificationType } from '../notifications.constants';

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
