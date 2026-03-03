import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TicketPriority, TicketStatus, TicketType } from '../tickets.constants';

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ type: String, required: false, index: true })
  tenantId?: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, trim: true, enum: Object.values(TicketType) })
  type: TicketType;

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
    required: true,
  })
  status: TicketStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  technician: Types.ObjectId;
}

export interface TicketDocument extends Document {
  tenantId: string;
  title: string;
  description: string;
  type: TicketType;
  clientId?: string;
  priority: TicketPriority;
  status: TicketStatus;
  technician: Types.ObjectId;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.index({ tenantId: 1, clientId: 1 });
TicketSchema.index({ tenantId: 1, status: 1 });
TicketSchema.index(
  { tenantId: 1, technician: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $ne: TicketStatus.COMPLETED },
    },
  },
);
