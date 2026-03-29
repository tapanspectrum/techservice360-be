import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface RepairDocument extends Document {
  tenantId: Types.ObjectId;
  clientId?: Types.ObjectId;
  productId?: Types.ObjectId;
  issue: string;
  status: string;
  priority: string;
  assignedTo?: string;
  cost?: number;
  resolvedAt?: Date;
}

@Schema({ timestamps: true })
export class Repair {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  clientId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Inventory' })
  productId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  issue: string;

  @Prop({ enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' })
  status: string;

  @Prop({ enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  priority: string;

  @Prop({ trim: true })
  assignedTo?: string;

  @Prop({ default: 0 })
  cost?: number;

  @Prop()
  resolvedAt?: Date;
}

export const RepairSchema = SchemaFactory.createForClass(Repair);
