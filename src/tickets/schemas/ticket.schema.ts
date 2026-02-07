import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

@Schema({ timestamps: true })
export class Ticket extends Document {
  title: string;
  description: string;
  clientId?: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  category?: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
