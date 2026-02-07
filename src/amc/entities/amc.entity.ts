import { Document } from 'mongoose';

export enum AMCStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export interface IAMC extends Document {
  clientId: string;
  contractNumber: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  description?: string;
  status: AMCStatus;
  scope?: string;
  terms?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
