import { Document } from 'mongoose';

export enum BillingStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

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
