import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

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
