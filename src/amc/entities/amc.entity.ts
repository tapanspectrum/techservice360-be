import { Document } from 'mongoose';
import { AMCStatus } from '../amc.constants';

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
