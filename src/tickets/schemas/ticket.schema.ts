import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TicketPriority, TicketStatus } from '../tickets.constants';

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  clientId?: string;

  @Prop({
    type: String,
    enum: Object.values(TicketPriority),
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Prop({
    type: String,
    enum: Object.values(TicketStatus),
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Prop()
  assignedTo?: string;

  @Prop()
  category?: string;
}

export interface TicketDocument extends Document {
  tenantId: string;
  title: string;
  description: string;
  clientId?: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  category?: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.index({ tenantId: 1, clientId: 1 });
TicketSchema.index({ tenantId: 1, status: 1 });
