import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TicketPriority, TicketStatus, TicketType } from '../tickets.constants';

export class CreateTicketDto {
  @IsOptional()
  tenantId: string;
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TicketType)
  type: TicketType;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @IsEnum(TicketStatus)
  status: TicketStatus;

  @IsString()
  technician: string;
}
