import { Document } from 'mongoose';
import { TicketPriority, TicketStatus } from '../tickets.constants';

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
