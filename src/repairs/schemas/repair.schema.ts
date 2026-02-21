import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Repair extends Document {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Client' })
  clientId: Types.ObjectId;

  @Prop({ required: true })
  deviceType: string;

  @Prop({ required: true })
  issue: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['pending', 'in-progress', 'completed'] })
  status: 'pending' | 'in-progress' | 'completed';
}

export const RepairSchema = SchemaFactory.createForClass(Repair);
