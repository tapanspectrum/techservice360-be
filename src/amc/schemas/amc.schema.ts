import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AMCStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Amc extends Document {
  clientId: string;
  contractNumber: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  description?: string;
  status: AMCStatus;
  scope?: string;
  terms?: string;
}

export const AmcSchema = SchemaFactory.createForClass(Amc);
