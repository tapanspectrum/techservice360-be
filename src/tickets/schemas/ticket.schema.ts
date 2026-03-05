import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface TicketDocument extends Document {
  tenantId: Types.ObjectId;
  clientId?: Types.ObjectId;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignedTo?: string;
  closedAt?: Date;
}

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  clientId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' })
  status: string;

  @Prop({ enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  priority: string;

  @Prop({ trim: true })
  assignedTo?: string;

  @Prop()
  closedAt?: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
