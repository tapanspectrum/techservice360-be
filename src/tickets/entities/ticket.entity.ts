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

export interface ITicket extends Document {
  title: string;
  description: string;
  clientId?: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
