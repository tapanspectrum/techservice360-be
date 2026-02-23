import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AmcPlanType, AMCStatus, PlanType } from '../amc.constants';

@Schema({ timestamps: true })
export class Amc {
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

  @Prop({ enum: Object.values(AmcPlanType), required: true })
  planType: PlanType;

  @Prop()
  scope?: string;

  @Prop()
  terms?: string;
}

export interface AmcDocument extends Document {
  tenantId: string;
  clientId: string;
  contractNumber: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  description?: string;
  status: AMCStatus;
  planType: PlanType;
  scope?: string;
  terms?: string;
}

export const AmcSchema = SchemaFactory.createForClass(Amc);

AmcSchema.index({ tenantId: 1, clientId: 1 });
AmcSchema.index({ tenantId: 1, status: 1 });
