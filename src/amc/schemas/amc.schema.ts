import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AMCStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}


export type PlanType = 'home' | '5pc' | '10pc' | '20pc';

@Schema({ timestamps: true })
export class Amc extends Document {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  contractNumber: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({ required: true })
  amount: number;

  @Prop()
  description?: string;

  @Prop({ enum: AMCStatus, required: true })
  status: AMCStatus;

  @Prop({ enum: ['home', '5pc', '10pc', '20pc'], required: true })
  planType: PlanType;

  @Prop()
  scope?: string;

  @Prop()
  terms?: string;
}

export const AmcSchema = SchemaFactory.createForClass(Amc);
