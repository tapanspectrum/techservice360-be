import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { TicketPriority, TicketStatus } from '../tickets.constants';

export class CreateTicketDto {
  @IsString()
  tenantId: string;
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @IsEnum(TicketStatus)
  status: TicketStatus;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
