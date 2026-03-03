import { Document } from 'mongoose';
import { TicketPriority, TicketStatus, TicketType } from '../tickets.constants';

export interface ITicket extends Document {
  title: string;
  description: string;
  type: TicketType;
  clientId?: string;
  priority: TicketPriority;
  status: TicketStatus;
  technician: string;
  createdAt?: Date;
  updatedAt?: Date;
}
