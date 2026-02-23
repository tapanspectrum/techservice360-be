import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BillingStatus } from '../billing.constants';

@Schema({ timestamps: true })
export class Billing {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true })
  invoiceNumber: string;

  @Prop({ required: true })
  clientId: string;

  @Prop()
  projectId?: string;

  @Prop({ required: true, type: Date })
  invoiceDate: Date;

  @Prop({ required: true, type: Date })
  dueDate: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 0 })
  taxAmount?: number;

  @Prop({ default: 0 })
  totalAmount?: number;

  @Prop({
    type: String,
    enum: Object.values(BillingStatus),
    default: BillingStatus.DRAFT,
  })
  status: BillingStatus;

  @Prop()
  description?: string;

  @Prop()
  paymentTerms?: string;
}

export interface BillingDocument extends Document {
  tenantId: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  taxAmount?: number;
  totalAmount?: number;
  status: BillingStatus;
  description?: string;
  paymentTerms?: string;
}

export const BillingSchema = SchemaFactory.createForClass(Billing);

BillingSchema.index({ tenantId: 1, clientId: 1 });
BillingSchema.index({ tenantId: 1, status: 1 });
BillingSchema.index({ invoiceNumber: 1 });
