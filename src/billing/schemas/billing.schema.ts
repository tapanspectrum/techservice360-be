import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum BillingStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Billing extends Document {
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
