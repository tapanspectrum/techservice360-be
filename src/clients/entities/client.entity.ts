import { Document, Types } from 'mongoose';

export interface IClient extends Document {
  tenantId?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address?: string;
  type?: 'office' | 'pg' | 'shop' | 'apartment';
  createdby?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
