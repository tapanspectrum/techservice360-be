import { Document } from 'mongoose';
import { BillingStatus } from '../billing.constants';

export interface IBilling extends Document {
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
  createdAt?: Date;
  updatedAt?: Date;
}
